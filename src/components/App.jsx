import React from "react";
//import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from "react-router-dom";
import Admin from "./admin";
// import Home from './home';
import NavBar from "./navbar";
import Store from "./store";
import Employee from "./employee";
import NotFound from "./notFound";
import NotAllowed from "./notAllowed";
import Login from "./login";
import User from "../model/user";
import Credential from "../model/credential";
import { getUserList } from "../pseudo-backend/userService";
import SignUp from "./signUp";
import title from "../image/title.jpg";

/*
  import { Link } from 'react-router-dom';
  <Link to="/">Home</Link> | <Link to="/newticket">Create Ticket</Link>
*/
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: getUserList(),
      loginCredential: new Credential(),
      currentUser: new User(),
      loggedIn: false,
      accessDenied: null,
      signUpCredential: new User(),
      signUpFail: null
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handleSignUpChange = this.handleSignUpChange.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    // this.redirectToLogin = this.redirectToLogin.bind(this);
  }

  handleLogin(event) {
    event.preventDefault();
    let userListCopy = this.state.userList.slice();
    let filterById = userListCopy.filter(
      user => user.id == this.state.loginCredential.id
    );
    if (filterById.length == 0) {
      this.setState({ accessDenied: true });
    } else if (filterById[0].password == this.state.loginCredential.password) {
      this.setState({
        accessDenied: false,
        loggedIn: true,
        currentUser: filterById[0],
        loginCredential: new Credential()
      });
    } else {
      this.setState({ accessDenied: true });
    }
  }

  handleLoginChange(event) {
    let loginCredential = Object.assign({}, this.state.loginCredential);
    loginCredential[event.currentTarget.id] = event.currentTarget.value;
    this.setState({ loginCredential: loginCredential });
  }

  handleLogOut() {
    this.setState({
      currentUser: new User(),
      loggedIn: false,
      accessDenied: null
    });
  }

  handleSignUp(event) {
    event.preventDefault();
    let userListCopy = this.state.userList.slice();
    let filterById = userListCopy.filter(
      user => user.id == this.state.signUpCredential.id
    );
    if (filterById.length != 0) {
      this.setState({ signUpFail: true });
      console.log("existing Id");
    } else {
      userListCopy.push(
        new User(
          this.state.signUpCredential.id,
          this.state.signUpCredential.name,
          this.state.signUpCredential.password
        )
      );

      this.setState({
        userList: userListCopy,
        signUpFail: false,
        loggedIn: null,
        currentUser: new User(),
        signUpCredential: new User(),
        loginCredential: new Credential()
      });
    }
  }

  handleSignUpChange(event) {
    let signUpCredential = Object.assign({}, this.state.signUpCredential);
    signUpCredential[event.currentTarget.id] = event.currentTarget.value;
    this.setState({ signUpCredential: signUpCredential });
  }

  render() {
    return (
      <div>
        <style jsx>
          {`
            .background {
              color: white;
              background: #ffffff url("${title}") no-repeat fixed;
              opacity: 0.6;
              position: absolute;
              z-index: -1;
            }
          `}
        </style>
        <NavBar
          logIn={this.redirectToLogin}
          logOut={this.handleLogOut}
          loggedIn={this.state.loggedIn}
          currentUser={this.state.currentUser}
        />
        <div className="jumbotron title">
          <h1>SeaTap</h1>
        </div>
        <img src={title} className="background" alt="background" />
        <div className="container">
          <Switch>
            <Route path="/store" component={Store} />
            <Route
              path="/admin"
              render={props => (
                <Admin {...props} currentUser={this.state.currentUser} />
              )}
            />
            <Route path="/employee" component={Employee} />
            <Route
              path="/login"
              render={props => (
                <Login
                  {...props}
                  onSubmit={e => this.handleLogin(e)}
                  onChange={e => this.handleLoginChange(e)}
                  loginCredential={this.state.loginCredential}
                  loggedIn={this.state.loggedIn}
                  accessDenied={this.state.accessDenied}
                />
              )}
            />
            <Route
              path="/signup"
              render={() => (
                <SignUp
                  onSubmit={e => this.handleSignUp(e)}
                  onChange={e => this.handleSignUpChange(e)}
                  signUpCredential={this.state.signUpCredential}
                  signUpFail={this.state.signUpFail}
                />
              )}
            />
            <Route path="/not-allowed" component={NotAllowed} />
            <Route path="/not-found" component={NotFound} />
            {/* <Route exact path="/" component={Home} /> */}
            <Redirect exact from="/" to="/store" />
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </div>
    );
  }
}

//App.propTypes = {
//};

export default App;
