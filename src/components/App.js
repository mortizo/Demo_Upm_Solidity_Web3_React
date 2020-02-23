import React, { Component } from 'react';
import getWeb3 from "./getWeb3";
import Contrato from "../abis/Contrato.json";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

import './App.css';

//https://www.youtube.com/watch?v=nvw27RCTaEw&t=1217s

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      cuenta:'',
      contrato:null,
      servicioList:[],
      missionList:[],
      valorTexto:'',
      valorMission:'',
      valorFather:''
    }
  }

  async componentWillMount(){
    this.web3 = await getWeb3();
    await this.loadBlockchainData()
  }

  async loadBlockchainData()
  {
    const cuentas = await this.web3.eth.getAccounts()
    this.setState({cuenta: cuentas[0]})
    const datosRed = Contrato.networks[await this.web3.eth.net.getId()]
    
    if(datosRed){
      const _contrato = new this.web3.eth.Contract(Contrato.abi, datosRed.address)
      this.setState({ contrato : _contrato})
      var _serviceList = new Array
      var _missionList = new Array
      
      for(var _i=1;_i<11;_i++)
      {
        var _service = await _contrato.methods.getService(_i).call()
        var _mission = await _contrato.methods.getMission(_i).call()
        
        _serviceList[_i]=_service
        _missionList[_i]=_mission
      }
      console.log(_serviceList)
      console.log(_missionList)
      
      this.setState({servicioList:_serviceList})
      this.setState({missionList:_missionList})
      
    }else{
      console.log("Contrato no ha sido desplegado en la red")
    }
  }

  setService = async (event) => {
    await this.state.contrato.methods.setService(this.state.valorTexto)
    .send({from: this.state.cuenta})
  }
  
  setMission = async (event) => {
    await this.state.contrato.methods.setMission(this.state.valorMission,this.state.valorFather)
    .send({from: this.state.cuenta})
  }
  

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.ups.edu.ec"
            target="_blank"
            rel="noopener noreferrer"
          >
            Demo
          </a>

          <ul className="navbar-brand px-3">
            <li className="navbar-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-secondary">
                <small id="Cuenta">Cuenta activa: {this.state.cuenta}</small>
              </small>
            </li>
          </ul>


        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
                        
              <div className="content mr-auto ml-auto">               
                
                <Form.Control id="valorTexto" name="valorTexto" type="text" 
                  placeholder="Descripción del Servicio" 
                  value={this.state.valorTexto}
                  onChange={this.onChange.bind(this)} 
                />
                <Button variant="primary" type="submit" onClick={this.setService} >Enviar</Button>
              
                <Form>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Address</th>
                        <th>Description</th>  
                      </tr>
                    </thead>
                    <tbody>
                        {this.state.servicioList.map(item => (
                          <tr>
                            <td>{item[0]}</td>
                            <td>{item[1]}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </Form>
                
                <Form.Control id="valorMission" name="valorMission" type="text" 
                  placeholder="Descripción de la Misión" 
                  value={this.state.valorMission}
                  onChange={this.onChange.bind(this)} 
                />
                <Form.Control id="valorFather" name="valorFather" type="text" 
                  placeholder="Código de la Misión Padre" 
                  value={this.state.valorFather}
                  onChange={this.onChange.bind(this)} 
                />
                
                <Button variant="primary" type="submit" onClick={this.setMission} >Enviar</Button>

                <Form>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Address</th>
                        <th>Description</th>  
                        <th>Father</th>  
                        
                      </tr>
                    </thead>
                    <tbody>
                        {this.state.missionList.map(item => (
                          <tr>
                            <td>{item[2]}</td>
                            <td>{item[0]}</td>
                            <td>{item[1]}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </Form>

              
              </div>
                            
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
