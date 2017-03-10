import Inferno from 'inferno';
import Header from './header';

import './layout.scss'

export default function (props) {
	return (
		<div id="app">
			<Header />
			<main id="content">
				{ props.children }
			</main>
		</div>
	);
}
