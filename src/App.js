import React,{Component} from 'react';
import SignIn from './Components/SignIn/SignIn';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo'
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Particles from 'react-tsparticles';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Register from './Components/Register/Register';
import { loadFull } from "tsparticles";
import Clarifai from 'clarifai';
import './App.css';

const app = new Clarifai.App({
  apiKey : '4f83df64dd4d4858acf05e89ffec1d84'
});

const dataBounce = {
  fpsLimit: 60,
  particles: {
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 3,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 120,
    },
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      input:'',
      imageUrl: '',
      box: {},
      route:'signin',
      isSignedIn: false
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value });
  }

  calculateFaceLocation = (data) =>{
    console.log(data);
    const clarifyFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol : clarifyFace.left_col * width,
      topRow : clarifyFace.top_row * height,
      rightCol : width - (clarifyFace.right_col * width),
      bottomRow : height - (clarifyFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) =>{this.setState({box:box})}

  onButtonSubmit = () =>{
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL,
    this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));

  }

  onRouteChange = (route) =>{
    if(route === 'singout'){
      this.setState({isSignedIn:false});
    }else if(route ==='home'){
      this.setState({isSignedIn:true});
    }
    this.setState({route:route});
  }  

  render() {
    const particlesInit = async (main) => { await loadFull(main);};
    const particlesLoaded = (container) => {};
    return (
      
      <div className="App">
        <Particles className='particles'
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={dataBounce}
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        {
          this.state.route === 'home'
          ? 
          <div>
            <Logo/>
            <Rank/>
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
          </div>
          :(
            this.state.route ==='signin'
            ? <SignIn onRouteChange={this.onRouteChange}/>
            : <Register onRouteChange={this.onRouteChange}/>
          )
        }
      </div>
    );
  }
}

export default App;
