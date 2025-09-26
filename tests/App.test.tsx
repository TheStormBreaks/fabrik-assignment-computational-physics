import React from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import App from '../src/App'
import '@testing-library/jest-dom'

//Mock three.js
jest.mock('@react-three/fiber', () => {
  return {
    Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-canvas">{children}</div>,
    useFrame: () => {}, // no-op
  }
})

jest.mock('@react-three/cannon', () => {
  return {
    Physics: ({ children }: { children: React.ReactNode }) => require('react').createElement('div', null, children),
    Debug: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    usePlane: () => [require('react').createRef()],
    useCompoundBody: () => [() => {}],
  }
})


describe('App Component', () => {

  //Test 1 Initialization 
  test('renders checkboxes and START button initially (checkboxes and START button)', () => {
    render(<App />)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(3)
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
  })

  
  //Test 2 Initialization
  test('verifies initial default checkbox states (1 checked, 2 checked, 3 unchecked)', () => {
    render(<App />)
    const physics1Checkbox = screen.getByRole('checkbox', { name: /physics # 1/i })
    const physics2Checkbox = screen.getByRole('checkbox', { name: /physics # 2/i })
    const physics3Checkbox = screen.getByRole('checkbox', { name: /physics # 3/i })

    expect(physics1Checkbox).toBeChecked()
    expect(physics2Checkbox).toBeChecked()
    expect(physics3Checkbox).not.toBeChecked()
  })


  //Test 3 User Interaction
  test('allows changing checkbox selection before starting', () => {
    render(<App />)
    const physics3Checkbox = screen.getByRole('checkbox', { name: /physics # 3/i })
    
    expect(physics3Checkbox).not.toBeChecked()
    fireEvent.click(physics3Checkbox) 
    expect(physics3Checkbox).toBeChecked()

    //start button click should later disable it
    fireEvent.click(screen.getByRole('button', { name: /start/i }))
    expect(physics3Checkbox).toBeDisabled()
    expect(physics3Checkbox).toBeChecked()
  })


  //Test 4 Negative Control
  test('disables checkboxes after clicking start', () => {
    render(<App />)
    const checkboxes = screen.getAllByRole('checkbox')
    const startButton = screen.getByRole('button', { name: /start/i })

    fireEvent.click(startButton)

    checkboxes.forEach((cb) => {
      expect(cb).toBeDisabled()
    })
  })


  //Test 5 Simulation Lifecycle
  test('switches start to restart button after running', async () => {
    render(<App />)
    const startButton = screen.getByRole('button', { name: /start/i })
    fireEvent.click(startButton)

    //wait for restart button to come up
    await waitFor(() => {
        expect(screen.getByRole('button', { name: /restart/i })).toBeInTheDocument()
    })
    
    //show that start is gone.
    expect(screen.queryByText('START')).not.toBeInTheDocument()
  })


  //Test 6 Simulation Lifecycle
  test('resets to start after clicking restart', () => {
    jest.useFakeTimers()
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /start/i }))
    const restartButton = screen.getByRole('button', { name: /restart/i }) 
    fireEvent.click(restartButton)

    act(() => {
      jest.runAllTimers()
    })

    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
    jest.useRealTimers()
  })


  //Test 7 State Reset
  test('restart re-enables checkboxes for new configuration', async () => {
    jest.useFakeTimers()
    render(<App />)

    // 1. disables controls
    fireEvent.click(screen.getByRole('button', { name: /start/i }))
    const checkboxes = screen.getAllByRole('checkbox')
    checkboxes.forEach((cb) => expect(cb).toBeDisabled())

    // 2. wait for restart and click it
    let restartButton: HTMLElement
    await waitFor(() => {
        restartButton = screen.getByRole('button', { name: /restart/i })
    })
    
    fireEvent.click(restartButton)

    // 3. allow effects/timers to run to complete the reset
    act(() => {
      jest.runAllTimers()
    })

    // 4. show checkboxes are now re-enabled
    checkboxes.forEach((cb) => expect(cb).toBeEnabled())
    
    jest.useRealTimers()
  })


  //Test 8 State Reset
  test('makes sure that start button is enabled after full restart ', async () => {
    jest.useFakeTimers()
    render(<App />)

    // 1. start the sim
    fireEvent.click(screen.getByRole('button', { name: /start/i }))

    // 2. wait for restart and click it
    let restartButton
    await waitFor(() => {
        restartButton = screen.getByRole('button', { name: /restart/i })
    })
    
    fireEvent.click(restartButton)

    // 3. sllow effects/timers to run
    act(() => {
      jest.runAllTimers()
    })

    // 4. show start button is enabled and ready to be clicked again
    const startButton = screen.getByRole('button', { name: /start/i })
    expect(startButton).toBeInTheDocument()
    expect(startButton).toBeEnabled()
    
    jest.useRealTimers()
  })


  //Test 9 Durability
  test('makes sure that full start to restart cycle executes twice properly', async () => {
    jest.useFakeTimers()
    render(<App />)

    //Round 1 Start and Restart
    const startButton1 = screen.getByRole('button', { name: /start/i })
    fireEvent.click(startButton1)
    await waitFor(() => expect(screen.getByRole('button', { name: /restart/i })).toBeInTheDocument())
    
    fireEvent.click(screen.getByRole('button', { name: /restart/i }))
    act(() => { jest.runAllTimers() })
    
    //Round 2 Start again (use the re-enabled button)
    const startButton2 = screen.getByRole('button', { name: /start/i })
    fireEvent.click(startButton2)
    
    //verify it switches back to restart after the second run
    await waitFor(() => expect(screen.getByRole('button', { name: /restart/i })).toBeInTheDocument())
    
    jest.useRealTimers()
  })
  

  //Test 10 Mock Integration
  test('mock canvas renders', () => {
    render(<App />)
    expect(screen.getByTestId('mock-canvas')).toBeInTheDocument()
  })
  
  
})
