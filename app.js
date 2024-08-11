class CounterButton extends MyReact.Component {
    constructor(props) {
      super();
      this.state = {count: 0};
      setInterval(() => {
        this.setState({count: this.state.count + 1})
      })
    }//update state super often
  
    render() {
      return (
        <div>
          <h1>{this.props.title}</h1>
          <ColorSwatch number={this.state.count}/>
          <div>
            Count:
            <span>{this.state.count}</span>
          </div>
        </div>
      )
    }
  }
  
  class ColorSwatch extends MyReact.Component {
    render() {
      const red = this.props.number % 256;
      return (
        <div
          style={{
            backgroundColor: `rgb(${red}, 0, 0)`,
            height: '50px',
            width: '50pc'
          }}
        />
      )
    }
  }
  
  MyReact.Render(
    <CounterButton title="Hello!"/>,
    document.getElementById('container')
  );