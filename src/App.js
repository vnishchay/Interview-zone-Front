import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import page_not_found from "./components/pagenotfound/page_not_found";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import InterviewPage from "./components/interviewpage/InterviewPage";
import ProfilePage from "./components/profile/profilepage";
import AddQuestion from "./components/question/addQuestion";
import Home from "./components/home/Home";
import { PrivateRoute } from "./components/auth/authContext";
import { AuthProvider } from "./components/auth/authContext";
import SearchPeerPage from "./components/searchPeer/serachPeer";
import BoopButton from "./components/notifications/sound"
import SetupPage from "./components/interviewpage/setupPage";
import SetQuestionsPage from "./components/setupInterview/selectProblemPage"
import FindCandiate from "./components/home/find-candidate";
import FindHost from "./components/home/find-host";

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Switch>
            <PrivateRoute exact path="/" component={Home}/>
            <PrivateRoute path='/setup/:id'>
              <SetupPage />
            </PrivateRoute>
            <PrivateRoute path='/interview/:id'>
              <InterviewPage />
            </PrivateRoute>
            <PrivateRoute path="/find-host" component={FindHost} ></PrivateRoute>
            <PrivateRoute path="/find-candidate" component={FindCandiate} ></PrivateRoute>
            <PrivateRoute path="/profile" component={ProfilePage} ></PrivateRoute>
            <PrivateRoute path="/search" component={SearchPeerPage}></PrivateRoute>
            <PrivateRoute path="/addproblem" component={AddQuestion} ></PrivateRoute>
            <PrivateRoute path="/boop" component={BoopButton} ></PrivateRoute>
            <PrivateRoute path={'/setupInterview'} component={SetQuestionsPage}></PrivateRoute>
            <Route path="*" component={page_not_found}></Route>
          </Switch>

        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
export default App;
