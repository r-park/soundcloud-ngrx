import { IPlayerState, ITimesState} from './player';
import { ISearchState} from './search';
import { TracklistsState, TracksState } from './tracklists';
import { UsersState } from './users';


export interface IAppState {
  player: IPlayerState;
  search: ISearchState;
  times: ITimesState;
  tracklists: TracklistsState;
  tracks: TracksState;
  users: UsersState;
}
