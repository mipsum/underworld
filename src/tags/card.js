import Inferno from 'inferno';

import './card.scss'

export default function (props) {
	return <div className="card">{ props.children }</div>
}
