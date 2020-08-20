import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';

class DeepmechNav extends React.Component {
    render() {
        return (
            <div>
                <Button onClick={() => mecElement.run()}>
                    Hello, world!!!!! This is src
                </Button>
            </div>
        );
    }
}

ReactDOM.render(<DeepmechNav/>, document.getElementById('deepmech_nav'))
