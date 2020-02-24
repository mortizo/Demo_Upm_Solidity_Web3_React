import React, { Component } from 'react';
import getWeb3 from "./getWeb3";
import Contrato from "../abis/Contrato.json";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Navbar from 'react-bootstrap/Navbar';

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
    console.log(cuentas[0])
    this.setState({cuenta: cuentas[0]})
    const datosRed = Contrato.networks[await this.web3.eth.net.getId()]
    
    if(datosRed){
      const _contrato = new this.web3.eth.Contract(Contrato.abi, datosRed.address)
      this.setState({ contrato : _contrato})
      var _serviceList = []
      var _missionList = []
      
      for(var _i=1;_i<= await _contrato.methods.totalService().call();_i++)
      {
        var _service = await _contrato.methods.getService(_i).call()
        _serviceList[_i]=_service
      }
      this.setState({servicioList:_serviceList})

      for(var _j=1;_j<= await _contrato.methods.totalMission().call();_j++)
      {
        var _mission = await _contrato.methods.getMission(_j).call()
        _missionList[_j]=_mission
      }
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
        
        <Navbar className=" bg-light justify-content-between">
          <Navbar.Brand href="http://www.ups.edu.ec">Demo - Dapp solidity / web 3 / react</Navbar.Brand>
          <Navbar.Text>
            Cuenta: {this.state.cuenta}
          </Navbar.Text>
        </Navbar>

        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">               

                <div>
                  <Form.Control id="valorTexto" name="valorTexto" type="text" 
                    placeholder="Descripción del Servicio" 
                    value={this.state.valorTexto}
                    onChange={this.onChange.bind(this)} />
                  <Button variant="primary" type="submit" onClick={this.setService} >Enviar</Button>                  
                  
                  <Table striped bordered hover>
                    <thead>
                      <tr>                        
                        <th>Service code</th> 
                        <th>Description</th>  
                        <th>Address</th>
                      </tr>
                    </thead>
                    <tbody>
                        {this.state.servicioList.map(item => (
                          <tr>
                            <td>{item[0]}</td>
                            <td>{item[1]}</td>
                            <td>{item[2]}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                            
                </div>


                <div>
                  <Form.Control id="valorMission" name="valorMission" type="text" 
                    placeholder="Descripción de la Misión" 
                    value={this.state.valorMission}
                    onChange={this.onChange.bind(this)} />
                  <Form.Control id="valorFather" name="valorFather" type="text" 
                    placeholder="Código de la Misión Padre" 
                    value={this.state.valorFather}
                    onChange={this.onChange.bind(this)} />
                
                  <Button variant="primary" type="submit" onClick={this.setMission} >Enviar</Button>

                  <Table striped bordered hover>
                     <thead>
                       <tr>
                         <th>Mission code</th>
                         <th>Address</th>
                         <th>Description</th>  
                         <th>Father</th>                          
                       </tr>
                     </thead>
                     <tbody>
                         {this.state.missionList.map(item => (
                          <tr>
                            <td>{item[0]}</td>
                            <td>{item[3]}</td>
                            <td>{item[1]}</td>
                            <td>{item[2]}</td>
                          </tr>
                         ))}
                     </tbody>
                  </Table>
                 
                </div>  

              </div>    
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
