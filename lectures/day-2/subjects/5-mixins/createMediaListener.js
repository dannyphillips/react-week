var createMediaListener = (media) => {
  var transientListener = null;

  var mediaKeys = Object.keys(media);

  var queryLists = mediaKeys.reduce((queryLists, key) => {
    queryLists[key] = window.matchMedia(media[key]);
    return queryLists;
  }, {});

  var mediaState = mediaKeys.reduce((state, key) => {
    state[key] = queryLists[key].matches;
    return state;
  }, {});

  var mutateMediaState = (key, val) => {
    mediaState[key] = val;
    notify();
  };

  var notify = () => {
    if (transientListener != null)
      transientListener(mediaState);
  };

  var listeners = mediaKeys.reduce((listeners, key) => {
    listeners[key] = (event) => {
      mutateMediaState(key, event.matches);
    };
    return listeners;
  }, {});

  var listen = (listener) => {
    transientListener = listener;
    mediaKeys.forEach((key) => {
      queryLists[key].addListener(listeners[key]);
    });
  };

  var dispose = () => {
    transientListener = null;
    mediaKeys.forEach((key) => {
      queryLists[key].removeListener(listeners[key]);
    });
  };

  var getState = () => mediaState;

  return { listen, dispose, getState };
};

module.exports = createMediaListener;
