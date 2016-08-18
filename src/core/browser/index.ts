import { MEDIA_QUERY_RULES, MediaQueryService } from './media-query-service';


export { MediaQueryService };
export { MediaQueryResults } from './interfaces';


export const BROWSER_PROVIDERS: any[] = [
  MediaQueryService,
  {provide: MEDIA_QUERY_RULES, useValue: [
    {
      id: 'large',
      minWidth: 980
    }
  ]}
];
