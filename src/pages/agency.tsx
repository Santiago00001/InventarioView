import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserView } from 'src/sections/agencys/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Agencias - ${CONFIG.appName}`}</title>
      </Helmet>

      <UserView />
    </>
  );
}
