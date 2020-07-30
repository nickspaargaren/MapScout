import React, { useState, useEffect, useMemo } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  withFirestore, isEmpty, isLoaded, withFirebase,
} from 'react-redux-firebase';
import NavBar from './NavBar';
import Auth from '../auth/Auth';
import Dashboard, { selectTeam } from '../dashboard/Dashboard';
import AddProvider from '../dashboard/AddProvider';
import PasswordForgetForm from '../auth/PasswordForget';
import Template from '../template/index';
import NotFound from '../NotFound';
import SentryWrapper from '../wrappers/SentryWrapper';
import Chat from '../chat';

export const providerRoute = '/provider';
export const formRoute = '/provider/add';
export const authRoute = '/auth';
export const pwdRoute = '/forgot';
export const templateRoute = '/provider/template';
export const chatRoute = '/provider/feeback';

function DashboardContent({ isAuth, auth }) {
  const PrivateRoute = ({ component: Component }) => (
    <Route render={(prps) => {
      if (isAuth) {
        return (
          <Redirect to={{
            pathname: authRoute,
            state: { from: prps.location },
          }}
          />
        );
      }
      return <Component {...prps} />;
    }}
    />
  );

  return useMemo(() => (
    <div className="dashboard-content">
      <Switch>
        <PrivateRoute
          exact
          path={providerRoute}
          component={Dashboard}
        />
        <PrivateRoute
          path={formRoute}
          component={AddProvider}
        />
        <PrivateRoute
          path={templateRoute}
          component={Template}
        />
        <PrivateRoute
          path={chatRoute}
          component={Chat}
        />
      </Switch>
    </div>
  ), [auth]);
}

const ProviderRoutes = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  async function fetchTeam() {
    const { firestore, team, firebaseAuth } = props;
    setIsLoading(true);
    if ((!team || !team.name) && typeof firebaseAuth.auth.uid === 'string') {
      await firestore
        .collection('users')
        .where('UID', '==', firebaseAuth.auth.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            const docData = doc.data();
            await firestore
              .collection('teams')
              .where('name', '==', docData.team)
              .get()
              .then((querySnapshot2) => {
                querySnapshot2.forEach((doc2) => {
                  const docData2 = doc2.data();
                  props.selectTeam(docData2);
                });
              });
          });
        });
      setIsLoading(false);
    } else if (isLoaded(firebaseAuth.auth) && firebaseAuth.auth.uid === undefined) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTeam();
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [props.firebaseAuth.auth]);

  const logout = () => {
    props.firebase.logout()
      .then(() => {
        props.selectTeam('');
        props.history.push(authRoute);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (isLoading || !isLoaded(props.firebaseAuth.auth)) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <SentryWrapper>
      <Switch>
        <Route path={providerRoute}>
          <>
            <NavBar
              team={props.team}
              logout={logout}
            />
            <DashboardContent
              isAuth={isEmpty(props.firebaseAuth.auth)}
              auth={props.firebaseAuth}
            />
          </>
        </Route>
        <Route
          exact
          path={authRoute}
          component={Auth}
        />
        <Route
          path={pwdRoute}
          component={PasswordForgetForm}
        />
        <Route exact path="*" component={NotFound} />
      </Switch>
    </SentryWrapper>
  );
};

function areEqual(prevProps, nextProps) {
  return prevProps.location === nextProps.location && prevProps.team === nextProps.team;
}

const mapDispatchToProps = {
  selectTeam,
};

const mapStateToProps = (state) => ({
  firebaseAuth: state.firebase,
  team: state.item.team,
});

// Need auth property to check if logged in or loading
export default compose(
  withFirestore,
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps),
)(React.memo(ProviderRoutes, areEqual));
