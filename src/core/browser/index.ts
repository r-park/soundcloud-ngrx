import { MEDIA_QUERY_RULES, MediaQueryService } from './media-query-service';


export { MediaQueryService };
export { MediaQueryResults } from './interfaces';


export const BROWSER_PROVIDERS: any[] = [
  MediaQueryService,
  {provide: MEDIA_QUERY_RULES, useValue: [
    {
      id: 'xsmall',
      maxWidth: 499
    },
    {
      id: 'small',
      minWidth: 500,
      maxWidth: 739
    },
    {
      id: 'medium',
      minWidth: 740,
      maxWidth: 979
    },
    {
      id: 'large',
      minWidth: 980
    },
    {
      id: 'landscape',
      orientation: 'landscape'
    },
    {
      id: 'portrait',
      orientation: 'portrait'
    }
  ]}
];
