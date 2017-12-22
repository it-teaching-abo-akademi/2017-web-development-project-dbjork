

import React, { Component } from 'react';



class Credits extends Component {

    render(){
        return (
            <div className={"credits"} style={{textAlign:"left", lineHeight:"90%"}}>
                <p> React:          <a href="https://reactjs.org/"> https://reactjs.org/</a></p>
                <p>Redux:          <a href="https://redux.js.org/">https://redux.js.org/</a></p>
                <p>redux-thunk:    <a href="https://github.com/gaearon/redux-thunk">https://github.com/gaearon/redux-thunk</a></p>
                <p>moment.js:      <a href="https://momentjs.com/">https://momentjs.com/</a></p>
                <p>moment-json-parser: <a href="https://github.com/capaj/moment-json-parser">https://github.com/capaj/moment-json-parser</a></p>
                <p>randomcolor:    <a href="https://github.com/davidmerfield/randomColor">https://github.com/davidmerfield/randomColor</a></p>
                <p>rc-slider:      <a href="https://github.com/schrodinger/rc-slider">https://github.com/schrodinger/rc-slider</a></p>
                <p>react-datepicker:<a href="https://github.com/Hacker0x01/react-datepicker">https://github.com/Hacker0x01/react-datepicker</a></p>
                <p>react-notification-badge:<a href="https://github.com/georgeosddev/react-notification-badge">https://github.com/georgeosddev/react-notification-badge</a></p>
                <p>recharts:<a href="http://recharts.org/">http://recharts.org/</a></p>
                <p>The modal windows (GraphPopup, ModalPopup and Settings) are a
                    pretty straight rip-off from a blog post by Dave Ceddia at
                    <a href="https://daveceddia.com/open-modal-in-react/">https://daveceddia.com/open-modal-in-react/</a>
                </p>
                <div className={"credits"}><p>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> and <a href="https://www.flaticon.com/authors/roundicons" title="Roundicons"> Roundicons </a> downloaded from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> are licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a> </p></div>
            </div>
        )
    }
}

export default Credits