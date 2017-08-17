
//import React from 'react';
//import ReactDOM from 'react-dom';
class RecordData extends React.Component{
  constructor(props){
    super(props);

  }
  render(){
    return <span>{this.props.recordData.text}</span>
  }
}
class RecordList extends React.Component{
  constructor(props){
    super(props)
    this.recordListHTML = ""
    this.onClickRecordButton = this.onClickRecordButton.bind(this)
  }

 onClickRecordButton(val){
   this.props.onClickRecordHandler(val)
   console.log(val)
 }

  render(){
    //recordListHTML = ""
    this.recordListHTML = this.props.recordList.map( (el) => {
      return(
      <li role="presentation" class="active" key={el} >
        <a href="#" onClick={this.onClickRecordButton(el)}> {el}</a>
      </li>
      )
    })

    //for(var i=0;i<this.props.recordList.length;i++){
    //  this.recordListHTML += <li>{this.props.recordList[i]}</li>
    //}
    return (<div class="container">
              <ul class="nav nav-pills nav-stacked"> {this.recordListHTML} </ul>
    </div>)
  }
}


class ResultsComponent extends React.Component{
  constructor(props){
    super(props);

  }


render(){
  return (
    <div class="container">
    <div class="row"><h1 class="text">{this.props.stateObj.selectedRecordName}</h1></div>
      <div class="row">
        <div class="col-md-3">
          <RecordList recordList = {this.props.recordList} onClickRecordHandler={this.props.onClickRecordHandler}/>
        </div>
        <div class="col-md-9">
          <RecordData recordName = {this.props.recordName} recordData = {this.props.recordData}/>
        </div>
      </div>
    </div>
  )
}

}


class FileSelectionBar extends React.Component{
  constructor(props){
    super(props)
    this.submitAction = this.submitAction.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(e){
    this.props.onInputChange(e.target.value)
  }
  submitAction(e){
    this.props.submitHandler()
  }
  render(){
    return (
      <div class="container">

        <span class="label label-default"> {this.props.label} </span>
        <input type="text" value={this.props.filePath} class = "form-control" onChange={this.handleInputChange} />
        <button class="btn btn-default" onClick={this.submitAction}>Submit</button>

      </div>
    )
  }
}

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      filePath: "",
      label: "Please select a file",
      recordList : [],
      recordData : {text:""},
      selectRecord:"",
      recordName:""
      ,selectedRecordName:""
    }
    this.handleFilePathChange = this.handleFilePathChange.bind(this)
    this.loadFileData = this.loadFileData.bind(this)
    this.loadRecordData = this.loadRecordData.bind(this)
  }
  handleFilePathChange(filePath){
    this.setState({
        filePath: filePath
      })
  }

 recordChanged(recordName){
   this.setState({recordName: recordName
   })
 }

loadFileData(){
  //alert('the filepath is '+ this.state.filePath)
  $.ajax({
    contentType : "application/json"
    ,method : "POST"
    ,url:'http://localhost:8080/api'
    ,data : JSON.stringify({filePath : this.state.filePath})
    //,processData : false
    ,dataType:'json'
    //,success:(data) => {this.setState({recordList:data.recordList})}.bind(this)
    //,error:() => {console.error(this.props.url, status, err.toString());}.bind(this)
  }).done((data) => {this.setState({recordList:data.recordList})})
  .fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    })
}
loadRecordData(recordName){
  //this.setState({selectedRecordName:recordName})
  //alert(recordName)
}
  render(){
    return (
      <div class="jumbotron">
        <h1>OM</h1>
        <FileSelectionBar submitHandler={this.loadFileData}
        filePath={this.state.filePath} label = {this.state.label} onInputChange = {this.handleFilePathChange}/>

        <ResultsComponent stateObj={this.state} onClickRecordHandler={this.loadRecordData}
        recordName= {this.state.recordName}
        filePath = {this.state.filePath} recordList={this.state.recordList}
        recordData={this.state.recordData}/>
        <br/><span>{this.state.filePath}</span>
      </div>
    )
  }
}



ReactDOM.render(
  <App />,
  document.getElementById('root')
);
