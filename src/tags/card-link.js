import Inferno from 'inferno';
import { Link } from 'inferno-router';

import './card-link.scss'


export default function (props) {
	return (
		<Link to={ props.to } className="card">{ props.children }</Link>
	)
};
