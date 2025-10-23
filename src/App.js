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
import BoopButton from "./components/notifications/sound";
import SetupPage from "./components/interviewpage/setupPage";
import ChatBox from "./components/chat/chatBox";
import SetQuestionsPage from "./components/setupInterview/selectProblemPage";
import FindCandiate from "./components/home/find-candidate";
import FindHost from "./components/home/find-host";
import Navbar from "./components/home/navbar";
import Activity from "./components/activity/activity";

function App() {
  return (
    <div className="root">
      <AuthProvider>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <PrivateRoute path="/setup/:id">
              <SetupPage />
            </PrivateRoute>
            <PrivateRoute path="/interview/:id">
              <InterviewPage />
            </PrivateRoute>
            <Route path={"/login"} component={Login}></Route>
            <Route path={"/register"} component={Register}></Route>
            <PrivateRoute path="/find-host">
              <Navbar></Navbar>
              <FindHost></FindHost>
            </PrivateRoute>
            <PrivateRoute
              path="/find-candidate"
              component={FindCandiate}
            ></PrivateRoute>
            <PrivateRoute exact path="/profile">
              <Navbar></Navbar>
              <ProfilePage></ProfilePage>
            </PrivateRoute>
            <Route path="/profile/:id">
              <Navbar></Navbar>
              <ProfilePage></ProfilePage>
            </Route>
            <PrivateRoute path="/search">
              <Navbar></Navbar>
              <SearchPeerPage></SearchPeerPage>
            </PrivateRoute>
            <PrivateRoute path="/addproblem">
              <Navbar></Navbar>
              <AddQuestion></AddQuestion>
            </PrivateRoute>
            <PrivateRoute path="/boop" component={BoopButton}></PrivateRoute>
            <PrivateRoute path={"/setupInterview"}>
              <Navbar></Navbar>
              <SetQuestionsPage></SetQuestionsPage>
            </PrivateRoute>
            <PrivateRoute path={"/chatbox"}>
              <Navbar></Navbar>
              <ChatBox></ChatBox>
            </PrivateRoute>
            <PrivateRoute path={"/activity"}>
              <Navbar></Navbar>
              <Activity></Activity>
            </PrivateRoute>
            <Route path="*" component={page_not_found}></Route>
          </Switch>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
export default App;
