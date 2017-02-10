// eslint-disable-next-line
import Inferno from 'inferno'

import { View as ClickView } from './widgets/counter'

// import Dropdown from './widgets/dropdown'

// const options = [
//   'one', 'two', 'three'
// ]

export default ({ model }) =>

  <div>




    <div class="container wrapper">

      <div class="row">
        <div class="column column-center">
          <div class="container">

            {/* <div class="row"> */}
              {/* <div class="column column-30 column-offset-33"> */}
                <div class="">
                  <h1><b>Monero Loop</b></h1>


                </div>

                <div class="well">
                  <h4><b>John Doe</b></h4>
                  <p>Architect & Engineers</p>
                  <ClickView model={log('@@@@@@ view', model.value)}/>

                  <button class="button button-black button-outline">
                    some btn
                  </button>

                  <ClickView model={model.value}/>

                </div>

                <div class="well">

                   {/* <Dropdown options={options} onChange={s => log('drop changed', s)} value={'two'} placeholder="Select an option" /> */}




                  <h4><b>John Doe</b></h4>
                  <p>Architect & Engineers</p>



                  {/* <form> */}
                    {/* <fieldset> */}
                      <label for="nameField">Name</label>
                      <input type="text" placeholder="CJ Patoilo" id="nameField" />
                      <label for="ageRangeField">Age Range</label>
                      <select id="ageRangeField" class="column column-33">
                        <option value="0-13">0-13</option>
                        <option value="14-17">14-17</option>
                        <option value="18-23">18-23</option>
                        <option value="24+">24+</option>
                      </select>
                      <div class="float-right">
                        <input type="checkbox" id="confirmField" />
                        <label class="label-inline" for="confirmField">Send a copy to yourself</label>
                      </div>
                      {/* <button class="button button-black button-outline" type="submit"> */}
                      <button class="button button-black button-outline">
                        Send
                      </button>
                    {/* </fieldset> */}
                  {/* </form> */}


                </div>



              {/* </div> */}
            {/* </div> */}


          </div>
        </div>
      </div>
    </div>

</div>

  // <div>
  //
  //
	// 		{/* <nav class="navigation">
	// 			<section class="container">
	// 				<a class="navigation-title" href="https://milligram.github.io/">
  //
	// 					<h1 class="title">Milligram</h1>
	// 				</a>
  //
	// 			</section>
	// 		</nav> */}
  //     {/* <main>
  //       <div class="Aligner">
  //         <div class="Aligner-item--fixed">
  //           <div class="card ">
  //             <h4><b>John Doe</b></h4>
  //             <p>Architect & Engineer</p>
  //             <ClickView model={model.value}/>
  //
  //             <button class="button button-black button-outline">
  //               some btn
  //             </button>
  //           </div>
  //         </div>
  //         <img src="img_avatar.png" alt="Avatar" style="width:100%" />
  //
  //       </div>
  //     </main> */}
  //
  //
  //
  //
  //
  //
  //
  //   {/* <div className="App">
  //     <div className="App-header">
  //       <Logo width="80" height="80"/>
  //       <h2>Welcome to Inferno</h2>
  //     </div>
  //     <p className="App-intro">
  //       To get started, edit <code>src/App.js</code> and save to reload.
  //     </p>
  //
  //   </div> */}


/*

<nav class="navigation">
  <section class="container">
    <a class="navigation-title" href="https://milligram.github.io/">
      <svg class="img" version="1.1" viewBox="0 0 463 669">
        <g transform="translate(0.000000,669.000000) scale(0.100000,-0.100000)">
          <path d="M2303 6677c-11-13-58-89-393-627-128-206-247-397-265-425-18-27-85-135-150-240-65-104-281-451-480-770-358-575-604-970-641-1032-10-18-45-74-76-126-47-78-106-194-107-212-1-3-11-26-24-53-60-118-132-406-157-623-19-158-8-491 20-649 82-462 291-872 619-1213 192-199 387-340 646-467 335-165 638-235 1020-235 382 0 685 70 1020 235 259 127 454 268 646 467 328 341 537 751 619 1213 28 158 39 491 20 649-25 217-97 505-157 623-13 27-23 50-23 53 0 16-57 127-107 210-32 52-67 110-77 128-37 62-283 457-641 1032-199 319-415 666-480 770-65 105-132 213-150 240-18 28-137 219-265 425-354 570-393 630-400 635-4 3-12-1-17-8zm138-904c118-191 654-1050 1214-1948 148-236 271-440 273-452 2-13 8-23 11-23 14 0 72-99 125-212 92-195 146-384 171-598 116-974-526-1884-1488-2110-868-205-1779 234-2173 1046-253 522-257 1124-10 1659 45 97 108 210 126 225 4 3 9 13 13 22 3 9 126 209 273 445 734 1176 1102 1766 1213 1946 67 108 124 197 126 197 2 0 59-89 126-197zM1080 3228c-75-17-114-67-190-243-91-212-128-368-137-580-34-772 497-1451 1254-1605 77-15 112-18 143-11 155 35 212 213 106 329-32 36-62 48-181 75-223 50-392 140-552 291-115 109-178 192-242 316-101 197-136 355-128 580 3 111 10 167 30 241 30 113 80 237 107 267 11 12 20 26 20 32 0 6 8 22 17 36 26 41 27 99 3 147-54 105-142 149-250 125z"></path>
        </g>
      </svg>
      &nbsp;
      <h1 class="title">Milligram</h1>
    </a>
    <ul class="navigation-list float-right">
      <li class="navigation-item">
        <a class="navigation-link" href="#popover-grid" data-popover>Docs</a>
        <div class="popover" id="popover-grid">
          <ul class="popover-list">
            <li class="popover-item"><a class="popover-link" href="#getting-started" title="Getting Started">Getting Started</a></li>
            <li class="popover-item"><a class="popover-link" href="#typography" title="Typography">Typography</a></li>
            <li class="popover-item"><a class="popover-link" href="#blockquotes" title="Blockquotes">Blockquotes</a></li>
            <li class="popover-item"><a class="popover-link" href="#buttons" title="Buttons">Buttons</a></li>
            <li class="popover-item"><a class="popover-link" href="#lists" title="Lists">Lists</a></li>
            <li class="popover-item"><a class="popover-link" href="#forms" title="Forms">Forms</a></li>
            <li class="popover-item"><a class="popover-link" href="#tables" title="Tables">Tables</a></li>
            <li class="popover-item"><a class="popover-link" href="#grids" title="Grids">Grids</a></li>
            <li class="popover-item"><a class="popover-link" href="#codes" title="Codes">Codes</a></li>
            <li class="popover-item"><a class="popover-link" href="#utilities" title="Utilities">Utilities</a></li>
            <li class="popover-item"><a class="popover-link" href="#tips" title="Tips">Tips</a></li>
            <li class="popover-item"><a class="popover-link" href="#browser-support" title="Browser Support">Browser Support</a></li>
            <li class="popover-item"><a class="popover-link" href="#examples" title="Examples">Examples</a></li>
            <li class="popover-item"><a class="popover-link" href="#contributing" title="Contributing">Contributing</a></li>
          </ul>
        </div>
      </li>
      <li class="navigation-item">
        <a class="navigation-link" href="#popover-support" data-popover>Support</a>
        <div class="popover" id="popover-support">
          <ul class="popover-list">
            <li class="popover-item"><a class="popover-link" target="blank" href="https://github.com/milligram/milligram" title="On Github">On Github</a></li>
            <li class="popover-item"><a class="popover-link" target="blank" href="https://codepen.io/milligramcss" title="On Codepen">On Codepen</a></li>
            <li class="popover-item"><a class="popover-link" target="blank" href="https://facebook.com/milligramcss" title="On Facebook">On Facebook</a></li>
            <li class="popover-item"><a class="popover-link" target="blank" href="https://twitter.com/milligramcss" title="On Twitter">On Twitter</a></li>
            <li class="popover-item"><a class="popover-link" target="blank" href="https://github.com/milligram/milligram/issues/new" title="Need help?">Need help?</a></li>
            <li class="popover-item"><a class="popover-link" target="blank" href="https://github.com/milligram/milligram#license" title="License">License</a></li>
            <li class="popover-item"><a class="popover-link" target="blank" href="https://github.com/milligram/milligram/releases" title="Versions">Versions</a></li>
          </ul>
        </div>
      </li>
    </ul>

    <a href="https://github.com/milligram/milligram" title="Milligram on Github" target="_blank">
      <svg class="octocat" viewBox="0 0 250 250"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path class="octocat-arm" d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"></path><path class="octocat-body" d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"></path></svg>
    </a>
  </section>
</nav>

*/
