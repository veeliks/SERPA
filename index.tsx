/* @refresh reload */

import "virtual:uno.css";
import { render } from "solid-js/web";

const Index = () => {
	return (
		<main class="w-lg p-lg b">
			<h1>SERPA</h1>
		</main>
	);
};

// render onto index.html
render(Index, document.body);
