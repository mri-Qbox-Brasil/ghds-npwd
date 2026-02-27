import { useReducer } from 'react';

const initialState = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
  expression: '',
  lastActionValue: null,
  lastActionOp: null,
  history: [],
};

const Reducer = (state, action) => {
  const { displayValue, firstOperand, waitingForSecondOperand, operator, expression, history } = state;

  switch (action.type) {
    case 'input_digit': {
      const digit = action.payload;

      if (waitingForSecondOperand) {
        return {
          ...state,
          displayValue: String(digit),
          waitingForSecondOperand: false,
        };
      }

      if (displayValue.replace(/[^0-9]/g, '').length >= 9 && displayValue !== '0') return state;

      return {
        ...state,
        displayValue: displayValue === '0' ? String(digit) : displayValue + digit,
      };
    }

    case 'input_dot': {
      if (waitingForSecondOperand) {
        return {
          ...state,
          displayValue: '0.',
          waitingForSecondOperand: false,
        };
      }

      if (!displayValue.includes('.')) {
        return {
          ...state,
          displayValue: displayValue + '.',
        };
      }
      return state;
    }

    case 'set_operator': {
      const nextOperator = action.payload;
      const inputValue = parseFloat(displayValue);

      if (operator && waitingForSecondOperand) {
        return {
          ...state,
          operator: nextOperator,
          expression: `${formatNumber(firstOperand)} ${nextOperator}`,
        };
      }

      if (firstOperand === null && !isNaN(inputValue)) {
        return {
          ...state,
          firstOperand: inputValue,
          operator: nextOperator,
          waitingForSecondOperand: true,
          expression: `${formatNumber(inputValue)} ${nextOperator}`,
        };
      } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);
        const newExpression = `${formatNumber(firstOperand)} ${operator} ${formatNumber(inputValue)} =`;

        return {
          ...state,
          displayValue: String(result),
          firstOperand: result,
          operator: nextOperator,
          waitingForSecondOperand: true,
          expression: `${formatNumber(result)} ${nextOperator}`,
          history: [{ expression: newExpression, result: String(result), id: Date.now() }, ...history],
        };
      }

      return {
        ...state,
        operator: nextOperator,
        waitingForSecondOperand: true,
      };
    }

    case 'calculate': {
      const inputValue = parseFloat(displayValue);

      if (operator && !waitingForSecondOperand) {
        const result = performCalculation[operator](firstOperand, inputValue);
        const newExpression = `${formatNumber(firstOperand)} ${operator} ${formatNumber(inputValue)} =`;

        return {
          ...state,
          displayValue: String(result),
          firstOperand: result,
          operator: null,
          waitingForSecondOperand: true,
          expression: newExpression,
          lastActionValue: inputValue,
          lastActionOp: operator,
          history: [{ expression: newExpression, result: String(result), id: Date.now() }, ...history],
        };
      }

      if (state.lastActionOp && state.lastActionValue !== null) {
        const result = performCalculation[state.lastActionOp](parseFloat(displayValue), state.lastActionValue);
        const newExpression = `${formatNumber(parseFloat(displayValue))} ${state.lastActionOp} ${formatNumber(state.lastActionValue)} =`;

        return {
          ...state,
          displayValue: String(result),
          expression: newExpression,
          waitingForSecondOperand: true,
          history: [{ expression: newExpression, result: String(result), id: Date.now() }, ...history],
        };
      }

      return state;
    }

    case 'clear_entry': {
      return {
        ...state,
        displayValue: '0',
      };
    }

    case 'clear_all': {
      return {
        ...initialState,
        history: state.history, // Preserve history even on AC
      };
    }

    case 'clear_history': {
      return {
        ...state,
        history: [],
      };
    }

    case 'restore_from_history': {
      return {
        ...state,
        displayValue: action.payload,
        waitingForSecondOperand: true,
      };
    }

    case 'toggle_sign': {
      const newValue = parseFloat(displayValue) * -1;
      return {
        ...state,
        displayValue: String(newValue),
      };
    }

    case 'percentage': {
      const floatValue = parseFloat(displayValue);
      if (floatValue === 0) return state;
      const newValue = floatValue / 100;
      return {
        ...state,
        displayValue: String(newValue),
      };
    }

    case 'backspace': {
      if (waitingForSecondOperand) return state;
      if (displayValue.length > 1) {
        return {
          ...state,
          displayValue: displayValue.slice(0, -1),
        };
      }
      return {
        ...state,
        displayValue: '0',
      };
    }

    default:
      return state;
  }
};

const formatNumber = (num) => {
  if (num === null) return '';
  if (Math.abs(num) > 999999999) return num.toExponential(4);
  const s = String(num);
  if (s.includes('.') && s.length > 11) {
    return Number(num).toFixed(8).slice(0, 11).replace(/\.?0+$/, '');
  }
  return s.slice(0, 11);
};

const performCalculation = {
  '/': (a, b) => a / b,
  '*': (a, b) => a * b,
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
};

export const useCalculator = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const inputDigit = (digit) => dispatch({ type: 'input_digit', payload: digit });
  const inputDot = () => dispatch({ type: 'input_dot' });
  const setOperator = (op) => dispatch({ type: 'set_operator', payload: op });
  const calculate = () => dispatch({ type: 'calculate' });
  const clearEntry = () => dispatch({ type: 'clear_entry' });
  const clearAll = () => dispatch({ type: 'clear_all' });
  const clearHistory = () => dispatch({ type: 'clear_history' });
  const restoreFromHistory = (val) => dispatch({ type: 'restore_from_history', payload: val });
  const toggleSign = () => dispatch({ type: 'toggle_sign' });
  const percentage = () => dispatch({ type: 'percentage' });
  const backspace = () => dispatch({ type: 'backspace' });

  const number = (n) => ({ label: String(n), onClick: () => inputDigit(n) });
  const opBtn = (op) => ({ label: op, onClick: () => setOperator(op) });

  const isEntryDirty = state.displayValue !== '0' || state.firstOperand !== null;

  return {
    displayValue: state.displayValue,
    expression: state.expression,
    activeOperator: state.operator && state.waitingForSecondOperand ? state.operator : null,
    isEntryDirty: isEntryDirty,
    history: state.history,

    // Commands
    equals: { label: '=', onClick: calculate },
    clear: {
      label: (state.displayValue !== '0') ? 'C' : 'AC',
      onClick: (state.displayValue !== '0') ? clearEntry : clearAll
    },
    clearHistory,
    restoreFromHistory,
    backspace: { label: 'backspace', onClick: backspace },
    percentage: { label: '%', onClick: percentage },
    toggleSign: { label: '+/-', onClick: toggleSign },

    // Digits
    zero: number(0),
    one: number(1),
    two: number(2),
    three: number(3),
    four: number(4),
    five: number(5),
    six: number(6),
    seven: number(7),
    eight: number(8),
    nine: number(9),
    dot: { label: '.', onClick: inputDot },

    // Operators
    divider: opBtn('/'),
    multiplier: opBtn('*'),
    adder: opBtn('+'),
    substractor: opBtn('-'),
  };
};
