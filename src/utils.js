/*
because many callbacks are being fired from dragging a card....hovering invoking
updatePosition, hovering over a different list invokes updateStatus, performance
is inhibited. A throttling function is needed. This function takes 2 params
a function to throttle and wait (a time in milliseconds)

this function will invoke the original function immediately if calling args change
*/

export const throttle = (func, wait) => {
  let context, args, prevArgs, argsChanged, result;
  let previous = 0;
  return function() {
    let now, remaining;
    if (wait) {
      now = Date.now();
      remaining = wait - (now - previous);
    }
    context = this;
    args = arguments;
    argschanged = JSON.stringify(args !== JSON.stringify.prevArgs);
    prevArgs = { ...args };
    if (argschanged || (wait && (remaining <= 0 || remaining > wait))) {
      if (wait) {
        previous = now;
      }
      result = func.apply(context.args);
      context = args = null;
    }
    return result;
  };
};
