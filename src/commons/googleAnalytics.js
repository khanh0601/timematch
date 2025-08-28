import { useLocation } from 'umi';
import ReactGA from 'react-ga';
import { useEffect } from 'react';

function usePageViews(trackingId) {
  ReactGA.initialize(trackingId);
  ReactGA.set({ page: '/booking-calendar' });
  ReactGA.pageview('/booking-calendar');
}

export default usePageViews;
