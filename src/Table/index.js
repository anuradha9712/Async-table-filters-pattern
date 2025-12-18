import * as React from "react";
import { debounce } from "throttle-debounce";
import { Card, Grid, Pagination, Toast } from "@innovaccer/design-system";
import { updateBatchData, getSelectAll, getTotalPages } from "../utility";
import { Header } from "../Header";
import { RightPanel } from "../RightPanel";
import "../style.css";

export class Table extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      schema: [],
      page: 1,
      totalRecords: 0,
      sortingList: props.sortingList || [],
      filterList: props.filterList || {},
      unselectedChipList: [],
      loading: true,
      error: false,
      selectAll: getSelectAll([]),
      searchTerm: undefined,
      showVerticalFilters: props.showVerticalFilters,
      pinnedFilterList: [],
      showToast: false,
    };

    this.pageSize = 10;
    this.searchDebounceDuration = 750;
    this.debounceUpdate = debounce(
      this.searchDebounceDuration,
      this.updateDataFn
    );
  }

  componentDidMount() {
    this.updateData();
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.page !== this.state.page) {
      const { onPageChange } = this.props;
      if (onPageChange) onPageChange(this.state.page);
    }

    if (
      prevState.page !== this.state.page ||
      prevState.filterList !== this.state.filterList ||
      prevState.sortingList !== this.state.sortingList ||
      prevState.searchTerm !== this.state.searchTerm ||
      prevState.unselectedChipList !== this.state.unselectedChipList
    ) {
      if (!this.props.loading) this.updateData({});
    }

    if (prevState.showToast !== this.state.showToast) {
      if (this.state.showToast) {
        setTimeout(() => {
          this.setState({
            showToast: false,
          });
        }, 1500);
      }
    }
  }

  handleToast(showToast) {
    this.setState({
      showToast: showToast,
    });
  }

  updateData() {
    this.setState({
      loading: true,
    });

    this.debounceUpdate();
  }

  updateDataFn() {
    this.onSelect(-1, false);

    const { fetchData } = this.props;

    const { page, sortingList, filterList, searchTerm, unselectedChipList } =
      this.state;

    const { pageSize } = this;

    const opts = {
      page,
      pageSize,
      sortingList,
      filterList,
      searchTerm,
      unselectedChipList,
    };

    this.setState({
      loading: true,
    });
    if (fetchData) {
      fetchData(opts)
        .then((res) => {
          const data = res.data;
          const schema = this.state.schema.length
            ? this.state.schema
            : res.schema;
          this.setState({
            data,
            schema,
            selectAll: getSelectAll(data),
            totalRecords: res.count,
            loading: false,
            error: !data.length,
          });
        })
        .catch(() => {
          this.setState({
            loading: false,
            error: true,
            data: [],
          });
        });
    }
  }

  onSelect(rowIndexes, selected) {
    const { data } = this.state;

    const { onSelect } = this.props;

    const indexes = [rowIndexes];
    let newData = data;
    if (rowIndexes >= 0) {
      newData = updateBatchData(data, indexes, {
        _selected: selected,
      });

      this.setState({
        data: newData,
        selectAll: getSelectAll(newData),
      });
    }

    if (onSelect) {
      onSelect(
        indexes,
        selected,
        rowIndexes === -1 ? [] : newData.filter((d) => d._selected)
      );
    }
  }

  onSelectAll(selected, selectAll) {
    const { onSelect } = this.props;

    const { data } = this.state;

    const indexes = Array.from({ length: data.length }, (_, i) => i);

    const newData = updateBatchData(data, indexes, {
      _selected: selected,
    });

    if (onSelect) {
      onSelect(
        indexes,
        selected,
        newData.filter((d) => d._selected),
        selectAll
      );
    }

    this.setState({
      data: newData,
      selectAll: getSelectAll(newData),
    });
  }

  onPageChange(newPage) {
    this.setState({
      page: newPage,
    });
  }

  onFilterChange(name, selected) {
    const { filterList } = this.props;

    const newFilterList = {
      ...filterList,
      [name]: selected,
    };

    this.updateFilterList(newFilterList);
  }

  updateShowVerticalFilters(val) {
    this.setState({
      showVerticalFilters: val,
    });
  }

  updateSchema(newSchema) {
    this.setState({
      schema: newSchema,
    });
  }

  updateSortingList(newSortingList) {
    const { multipleSorting } = this.props;

    this.setState({
      sortingList: multipleSorting
        ? [...newSortingList]
        : newSortingList.slice(-1),
      page: 1,
    });
  }

  updateFilterList(newFilterList) {
    this.setState({
      filterList: newFilterList,
      page: 1,
    });
  }

  updateSelectedChipList(newList) {
    this.setState({
      unselectedChipList: newList,
      page: 1,
    });
  }

  updateSearchTerm(newSearchTerm) {
    this.setState({
      searchTerm: newSearchTerm,
      page: 1,
    });
  }

  handleCloseHandler() {
    this.setState({ showVerticalFilters: false });
  }

  setPinnedFilterList(pinnedList) {
    this.setState({
      pinnedFilterList: pinnedList,
    });
  }

  render() {
    const { loaderSchema } = this.props;

    const withCheckbox = true;
    const withPagination = true;
    const { pageSize } = this;

    const { totalRecords, showVerticalFilters, loading } = this.state;
    const totalPages = getTotalPages(totalRecords, pageSize);

    const classNames = showVerticalFilters ? "Table-verticalFilter" : "w-100";

    const headerOptions = {
      loading,
      showVerticalFilters,
      filterList: this.state.filterList,
      onFilterChange: this.onFilterChange,
      updateFilterList: this.updateFilterList.bind(this),
      updateSelectedChipList: this.updateSelectedChipList.bind(this),
      toggleVerticalFilter: this.updateShowVerticalFilters.bind(this),
      unselectedChipList: this.state.unselectedChipList,
      updateSearchTerm: this.updateSearchTerm.bind(this),
      updateSchema: this.updateSchema.bind(this),
      updateShowVerticalFilters: this.updateShowVerticalFilters.bind(this),
      onSelectAll: this.onSelectAll.bind(this),
      withCheckbox: withCheckbox,
      withPagination: withPagination,
      pageSize: pageSize,
      pinnedFilterList: this.state.pinnedFilterList,
      setShowToast: this.handleToast.bind(this),
    };

    const headerProps = { ...this.state, ...headerOptions };

    return (
      <div>
        <div className="d-flex vh-100">
          <div className={classNames}>
            <Card className="Table overflow-hidden pt-5">
              <div className="Table-header pl-5 pb-5">
                <Header {...headerProps} />
              </div>
              <div className="Table-grid">
                <Grid
                  {...this.state}
                  updateData={this.updateData.bind(this)}
                  updateSchema={this.updateSchema.bind(this)}
                  updateSortingList={this.updateSortingList.bind(this)}
                  updateFilterList={this.updateFilterList.bind(this)}
                  withCheckbox={withCheckbox}
                  onSelect={this.onSelect.bind(this)}
                  onSelectAll={this.onSelectAll.bind(this)}
                  showMenu={true}
                  type="data"
                  size="comfortable"
                  draggable={true}
                  withPagination={withPagination && totalPages > 1}
                  pageSize={pageSize}
                  loaderSchema={loaderSchema}
                />
              </div>
              {withPagination && totalPages > 1 && (
                <div className="Table-pagination">
                  <Pagination
                    page={this.state.page}
                    totalPages={getTotalPages(totalRecords, pageSize)}
                    type="jump"
                    onPageChange={this.onPageChange.bind(this)}
                  />
                </div>
              )}
            </Card>
          </div>
          <RightPanel
            loading={loading}
            onCloseHandler={() => this.setState({ showVerticalFilters: false })}
            showVerticalFilters={showVerticalFilters}
            filterList={this.state.filterList}
            updateFilterList={this.updateFilterList.bind(this)}
            setPinnedFilterList={() => this.setPinnedFilterList.bind(this)}
          />
        </div>
        {this.state.showToast && (
          <Toast
            appearance="success"
            title="Saved filter view"
            onClose={this.handleToast.bind(this)}
            className="position-fixed Filter-toast"
            message="You can find this view later in the “filter views” list."
          />
        )}
      </div>
    );
  }
}

export default Table;
