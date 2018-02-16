class ReactServiceWorker extends React.Component {
  state = { counter: 0 }

  decrement = event => {
    this.stateToServiceWorker({
      property: 'counter',
      state: this.state.counter - 1
    })
    this.setState(prevState => ({ counter: prevState.counter - 1 }))
  }

  increment = event => {
    this.stateToServiceWorker({
      property: 'counter',
      state: this.state.counter + 1
    })
    this.setState(prevState => ({ counter: prevState.counter + 1 }))
  }

  stateToServiceWorker(data) {
    if (navigator.serviceWorker && navigator.serviceWorker.controller)
      navigator.serviceWorker.controller.postMessage(data)
  }

  componentDidMount() {
    const self = this
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('service-worker.js')
        .then(() => navigator.serviceWorker.ready)
        .then(() => {
          navigator.serviceWorker.addEventListener('message', function(event) {
            if (event.data && event.data.property === 'counter' && event.data.state !== undefined )
              self.setState({ counter: event.data.state })
          })
        })
        .catch((error) => {
          console.log('Error : ', error)
        })
    }
  }
  render() {
    return (
      <div id="counter-container">
        <button id="decrement" onClick={this.decrement}>-</button>
        <div id="counter">{this.state.counter}</div>
        <button id="increment" onClick={this.increment}>+</button>
      </div>
    )
  }
}

ReactDOM.render(<ReactServiceWorker />, document.getElementById('root'))
