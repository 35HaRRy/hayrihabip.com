export interface Page {
  PageSize: number;
  PageIndex: number;
}

export type Pager<T extends any = {}> =
  Page
  & {
    Rows?: T[];
    ShowingFirstRowIndex: number;
    ShowingLastRowIndex: number;
    TotalPageCount: number;
    TotalRecord: number;
    ViewingRecord: number;
  };

export const getEmptyPager = <T>(): Pager<T> => ({
  PageSize: 25,
  PageIndex: 0,
  Rows: [],
  ShowingFirstRowIndex: 0,
  ShowingLastRowIndex: 0,
  TotalPageCount: 1,
  TotalRecord: 0,
  ViewingRecord: 0
});
