import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

export default class MainDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps };
  }
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          {/*Below we add the modal wrapper*/}
          <div id="modal-root"></div>
        </body>
      </Html>
    );
  }
}