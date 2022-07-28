import React from 'react'
import axios from 'axios'
import './App.scss'

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      file: '',
      filename: '',
      result: 'Waiting for image...',
      message: 'Please enter a picture of your rice leaf and click the identify button to find out the disease on your rice leaf'
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e){
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', e.target.image.files[0]);

    const message = {
      'blast' : 'Your rice leaf is infected with blast. Blast disease is a disease caused by the fungus Pylicularia grisea. This fungus can infect all phases of rice plant growth, from the nursery phase to the generative phase. Plants that are attacked by blast disease are characterized by brown rhombus-shaped spots on the leaves of rice plants.',
      'blight' : 'Your rice leaf is infected with blight. Blight disease is caused by the bacterium Xanthomonas campestris pv. Oryzae. Yield loss reaches 20.6 - 35.8% in the rainy season, while in the dry season it reaches 17.5 - 28%.',
      'tungro' : 'Your rice leaf is infected with tungro. Tungro disease is a rice disease caused by two types of viruses, namely stem-shaped virus or rice tungro stem virus Rice tungro bacilliform virus (RTBV), and rice tungro spherical virus or rice tungro virus (RTSV).'
    }

    axios.post(`http://127.0.0.1:5000`, formData)
      .then(res => {
        console.log(res.data);
        this.setState({
          result: res.data,
          message: res.data === 'Blast' ? message.blast : res.data === 'Blight' ? message.blight : message.tungro
          
        })
      })
  }
  

  handleChange(e){
    e.preventDefault();
    console.log(e.target.files[0].name);
    this.setState({
      file: URL.createObjectURL(e.target.files[0]),
      filename : e.target.files[0].name
    })
  }

  render(){
    return(
      <div className='container-lg card shadow p-4 border border-0 m-auto main-wrapper position-absolute top-50 start-50 translate-middle'>
        <center>
          <div className="content">
            <h1 className='card-title'>Rice Leaf Desease Identifier</h1>
            <form method="post" onSubmit={this.handleSubmit}>
              <div className="image-wrapper">
                <img src={this.state.file} name='image' className='img-fluid' crossOrigin='anonymous' />
              </div>
              <div class="input-group">
                <input type="file" class="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" name='image' onChange={this.handleChange} />
                <button class="btn btn-primary" type="submit" id="inputGroupFileAddon04">Identify</button>
              </div>
            </form>
            <br />
            
          </div>
          <div class="alert alert-success" role="alert">
            <h4 class="alert-heading">{this.state.result}</h4>
            <p>{this.state.message}</p>
          </div>
        </center>

      </div>
    )
  }
}

export default App