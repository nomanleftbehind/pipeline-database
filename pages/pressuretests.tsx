import Layout from '../components/layout';
import MenuBar from '../components/menubar';
import { ReactNode } from 'react';
import GenericTable from '../components/rows/GenericTable';


export default function PressureTests() {
  return <GenericTable table='pressure tests' />
}

PressureTests.getLayout = function getLayout(page: ReactNode) {

  return (
    <Layout>
      <MenuBar />
      {page}
    </Layout>
  )
}