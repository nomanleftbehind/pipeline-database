import Layout from '../components/layout';
import MenuBar from '../components/menubar';
import { ReactNode } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// import ProTip from '../src/ProTip';
// import Link from '../src/Link';
// import Copyright from '../src/Copyright';

export default function Facilities() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js v5 example
        </Typography>
        {/* <Link href="/about" color="secondary">
          Go to the about page
        </Link>
        <ProTip />
        <Copyright /> */}
      </Box>
    </Container>
  )
}

Facilities.getLayout = function getLayout(page: ReactNode) {
  return (
    <Layout>
      <MenuBar />
      {page}
    </Layout>
  )
}