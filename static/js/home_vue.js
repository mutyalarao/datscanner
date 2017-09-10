


Vue.component('fileinput',{
  props:['label','openFile']
  ,template: `<div>
    <span> {{label}} </span>
    <input type="text" v-model="filepathvalue">
    <button @click="callOpenFile"> Submit </button>
  </div>`
  ,data : function(){ return{ filepathvalue : ''} }
  ,methods:{
    callOpenFile: function(){
      this.openFile(this.filepathvalue)
    }
  }

})

Vue.component('recordlist',{
  props:['recordName','loadRecord']
  ,template:` <button  class="btn btn-primary " @click="process(recordName)"> {{recordName}} </button>`
  ,data : function(){
    return {selected:false}
  }
  ,methods:{
    process:function(name){
      this.selected = !this.selected

      this.loadRecord(name)
    }
  }
})



/*Vue.component('fileinput',{
props:['label','fileName']
,template:`<span>{{label}}<span>
<input>{{fileName}}</input>
<button></button>
`
})*/

var app = new Vue({
  el: '#app'
,data:{ recordList: []
        ,recordData:[]
        ,filePath : ""
        ,recordDataHtml: ""
        ,selectedRecord: ""
      }
,methods:{
  openFile: function(filePathParam){
  //ajax call to server to process the file
//alert(filePathParam)
  $.ajax({
    contentType : "application/json"
    ,method : "POST"
    ,url:'http://localhost:8080/api'
    ,data : JSON.stringify({'command':'openfile',filePath : filePathParam})
    //,processData : false
    ,dataType:'json'
    //,success:(data) => {this.setState({recordList:data.recordList})}.bind(this)
    //,error:() => {console.error(this.props.url, status, err.toString());}.bind(this)
  })
  .done((data) => { this.recordList = data.recordList })
  .fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    })

  }
  ,loadRecord : function(recordName){
    //ajax cal
    this.selectedRecord = recordName
    $.ajax({
      contentType : "application/json"
      ,method : "POST"
      ,url:'http://localhost:8080/api'
      ,data : JSON.stringify({'command':'record','recordName' : recordName})
      //,processData : false
      ,dataType:'json'
      //,success:(data) => {this.setState({recordList:data.recordList})}.bind(this)
      //,error:() => {console.error(this.props.url, status, err.toString());}.bind(this)
    })
    .done((data) => { this.recordDataHtml = data.recordData})
    .fail(function( jqXHR, textStatus ) {
        alert( "Request failed: " + textStatus );
      })
  }
}//methods
})
