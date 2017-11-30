'use strict';

var handleDomo = function handleDomo(e) {
  e.preventDefault();

  //$('#domoMessage').animate({width: 'hide'}, 350);

  if ($('#domoName').val() == '' || $('#domoAge').val() == '') {
    handleError('RAWR! All fields are required');
    return false;
  }

  sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), function () {
    loadDomosFromServer();
  });

  return false;
};

//Domo UI
var DomoForm = function DomoForm(props) {
  return React.createElement(
    'form',
    { id: 'domoForm', name: 'domoForm', onSubmit: handleDomo, action: '/maker', method: 'POST', className: 'domoForm' },
    React.createElement(
      'label',
      { htmlFor: 'name' },
      'Name: '
    ),
    React.createElement('input', { id: 'domoName', type: 'text', name: 'name', placeholder: 'Domo Name' }),
    React.createElement(
      'label',
      { htmlFor: 'age' },
      'Age: '
    ),
    React.createElement('input', { id: 'domoAge', type: 'text', name: 'age', placeholder: 'Domo Age' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Make Domo' })
  );
};

//Determine what Domos to draw
var DomoList = function DomoList(props) {
  //No Domos
  if (props.domos.length === 0) {
    return React.createElement(
      'div',
      { className: 'domoList' },
      React.createElement(
        'h3',
        { className: 'emptyDomo' },
        'No Domos yet'
      )
    );
  }

  //Create UI for each Domo
  var domoNodes = props.domos.map(function (domo) {
    return React.createElement(
      'div',
      { key: domo._id, className: 'domo' },
      React.createElement('img', { src: '/assets/img/domoface.jpeg', alt: 'domo face', className: 'domoFace' }),
      React.createElement(
        'h3',
        { className: 'domoName' },
        'Name: ',
        domo.name
      ),
      React.createElement(
        'h3',
        { className: 'domoAge' },
        'Age: ',
        domo.age
      )
    );
  });

  //Render out the Domo UIs
  return React.createElement(
    'dim',
    { className: 'domoList' },
    domoNodes
  );
};

//Load Domos from the server and render a DomoList
var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector('#domos'));
  });
};

var setup = function setup(csrf) {
  //Render the MakeDomo UI
  ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector('#makeDomo'));

  //Render the DomoList UI
  ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector('#domos'));

  //Load any Domos
  loadDomosFromServer();
};

//Get the csrf token from the server
var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

//Get the token when the page loads
$(document).ready(function () {
  getToken();
});
'use strict';

var handleError = function handleError(message) {
  document.querySelector('#errorMessage').textContent = message;
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    }
  });
};