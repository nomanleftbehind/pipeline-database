import type { AppLayoutProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import AuthProvider from '../context/AuthContext';
import { useApollo } from '../graphql/client';
import '../styles/globals.css';
import Layout from '../components/layout';
// import '../styles/styles-formik.css';
// import '../styles/styles-custom-formik.css';



export default function PipelineIntegrityApp({ Component, pageProps }: AppLayoutProps) {

  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <Layout title='Pipeline Database'>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ApolloProvider>
  )
}