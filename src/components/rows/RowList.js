import React from "react";
import { connect } from "react-redux";
import { getRows, getGardens} from "../../actions/index";
import { Link } from "react-router-dom";

class RowList extends React.Component {

  componentDidMount() {
    this.props.getRows();
    this.props.getGardens();
  };

  userAuthorize = (row) => {
    if (row.userId === this.props.curUserId && this.props.curUserId) {
      const currentGarden = this.props.gardens.filter(garden => garden.id == this.props.match.params.id);
      if (currentGarden[0]) {
        return (
          <React.Fragment>          
            <Link className="ui button right floated" to={`/gardens/${currentGarden[0].id}/rows/edit/${row.id}`} style={{border: "1px black solid", marginRight: "1rem"}}>Edit</Link>          
            <Link className="ui button right floated" to={`/gardens/${currentGarden[0].id}/rows/delete/${row.id}`} style={{border: "1px black solid"}}>Delete</Link>         
          </React.Fragment>        
        );
      }
      if (!currentGarden[0]) {
        return (
          <div>Loading...</div>
        );
      };
      
    };
  };

  rgbaBack = (row) => {
    const {r, g, b, a} = row.colorBack;
    return `linear-gradient(90deg, rgba(${r}, ${g}, ${b}, 0.75) 10%, rgba(${r}, ${g}, ${b}, ${a}), rgba(${r}, ${g}, ${b}, 0.75) 90%)`;
  }

  rgbaText = (row) => {
    const {r, g, b} = row.colorText;
    return `rgb(${r}, ${g}, ${b})`
  }

  rowList() {
    const gardenNum = (window.location.pathname).split(`/`)[2];
    const currentGardenRow = this.props.rows.filter(row => row.gardenNum == gardenNum)

    return currentGardenRow.map((row) => {
      return (
        <div className="item" key={row.id}>          
          <div className="content" style={{
            background: this.rgbaBack(row),
            color: this.rgbaText(row),
            border: "2px black solid",
            marginBottom: "2rem",
            borderRadius: "1rem",
            padding: "1rem",
            boxShadow: "0rem .2rem .7rem .2rem rgba(0,0,0,.1)"
          }}>
              <Link className="header" to={`/gardens/${gardenNum}/rows/${row.id}`} style={{
                color: this.rgbaText(row),
                fontSize: "1.3rem",
                fontWeight: "bold",
                marginLeft: "1rem"
              }}>{row.plant.toUpperCase()}</Link>
              {this.userAuthorize(row)}
              <div className="description" style={{marginLeft: "1rem"}}>
                {row.variety[0].toUpperCase() + row.variety.slice(1).toLowerCase()}                 
              </div>                               
          </div> 
        </div>                      
      );
    });
  };

  createRowButton = () => {
    const gardenNum = (window.location.pathname).split(`/`)[2];

    if (this.props.isSignedIn) {
      return (
        <div className="ui button right floated content" style={{
          border: "1px black solid",
          boxShadow: "0rem .2rem .7rem .2rem rgba(0,0,0,.1)"
        }}>
          <Link to={`/gardens/${gardenNum}/rows/new`}>Plant Item</Link>
        </div>        
      );
    };
  };
  
  render() {
    const currentGarden = this.props.gardens.filter(garden => garden.id == this.props.match.params.id);
    if (currentGarden[0]) {
      return (
        <div>
          <h1>{currentGarden[0].gardenTitle}</h1>
          {this.rowList()}
          {this.createRowButton()}    
        </div>
        );
    }
    if (!currentGarden[0]) {
      return <h3>Loading...</h3>
    }
    
  };
  
};

const mapStateToProps = (state) => {
  return {
    gardens: Object.values(state.gardens),
    rows: Object.values(state.rows),
    curUserId: state.auth.userId,
    isSignedIn: state.auth.isSignedIn
  };
};

export default connect(mapStateToProps, {getRows, getGardens})(RowList);