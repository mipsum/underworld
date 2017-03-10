// import './polyfills'

// test
import './__tests__/middlewares'

import 'normalize.css'
import 'milligram'

// import 'roboto-fontface/css/roboto/roboto-fontface.css'

// import './index.css'
// import './app.scss'
// import './card.scss'


// import runApp from './app'

// document.addEventListener("DOMContentLoaded", runApp)



import Inferno from 'inferno';
import { Router } from 'inferno-router';
import { createBrowserHistory } from 'history';
import views from './app';

const history = createBrowserHistory();

const App = () => (
	<Router history={ history }>
    { views }
  </Router>
);

Inferno.render(App(), document.getElementById('app'));


if (!__DEV__) {
	// cache all assets if browser supports serviceworker
	if ('serviceWorker' in navigator && location.protocol === 'https:') {
		navigator.serviceWorker.register('/service-worker.js');
	}

	// // add Google Analytics
	// (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	// (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	// m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	// })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
	// ga('create', 'UA-XXXXXXXX-X', 'auto');
	// ga('send', 'pageview');

	// track pages on route change
	window.ga && history.listen(obj => ga('send', 'pageview', obj.pathname));
}
