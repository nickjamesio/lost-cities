import fetch from 'node-fetch';
import {
  createGenerateClassName,
} from '@material-ui/core/styles';

const generateClassName = createGenerateClassName()

export default {
  plugins: [
    [
      'react-static-plugin-jss',
      {
        providerProps: {
          generateClassName,
        },
      },
    ],
  ],
  getSiteData: () => ({
    title: 'React Static',
  }),
  getRoutes: async () => {
    // const data = await fetch(
    //   'https://jsonplaceholder.typicode.com/posts'
    // ).then(data => data.json())
    return [
      {
        path: '/products',
        component: 'src/containers/Products',
      },
    ]
  },
  devServer: {
    host: '0.0.0.0',
  }
}
