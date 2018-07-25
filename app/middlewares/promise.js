export default function promiseMiddleware() {
    return next => (action) => {
      const { promise, types } = action;
      if (!promise) {
        return new Promise(resolve => resolve(next(action)));
      }
      const [REQUEST, SUCCESS, FAILURE] = types;
      next({ type: REQUEST });
      return promise.then(
        (result) => {
          next({ result, type: SUCCESS });
        },
        (error) => {
          next({ error, type: FAILURE });
        }
      );
    };
  }
  