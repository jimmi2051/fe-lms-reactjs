import React, { Component } from "react";
import _ from "lodash";
class Question extends Component {

  state = {
      result : "",
      status: -1,
      answer: {}
  }
  handleChooseAnswer = (answer) =>{
      
     this.setState({answer,status: -1})
  }
  handleSubmit = () =>{
    const {answer} =this.state;
    if(answer.result)
    {
        this.setState({result:"You're correct.",status:1})
    }
    else{
        this.setState({result:"You're wrong.",status:0})
    }
  }
  render() {
      const {result,status} = this.state;
    return (
     <div>
         {status !== -1 && (
             <label className={`${status===0?"text-danger":"text-success"}`}>{result}</label>
         )}
         <br/>
         <label>{this.props.question}</label>
         <br/>
        {this.props.answer && this.props.answer.map((item,index)=>{
            console.log("Render>>>",this.state.answer);
            return (
                <div className={` ${status===0 && _.isEqual(this.state.answer,item)?"bg-danger":""} ${_.isEqual(this.state.answer,item)?"bg-root":""}`} key={index} onClick={()=>this.handleChooseAnswer(item)} style={{cursor:"pointer"}}>
                    Answer {index+1}: {item.ans1}
                </div>
            )
        })}
        <button type="button" onClick={this.handleSubmit} className="btn btn-success">Submit</button>
     </div>
    );
  }
}
export default Question;
