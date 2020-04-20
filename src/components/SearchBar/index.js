import React, { Component } from "react";
import {
  Button,
  Select,
  Input,
  Search,
  Dropdown,
  Label,
  Grid,
} from "semantic-ui-react";
import {
  getTrendingTags,
  getRecentTags,
  getAllTags,
} from "../../util/APIUtils";
import "./style.less";

const options = [
  { key: "all", text: "All", value: "all" },
  { key: "articles", text: "Images", value: "images" },
  { key: "products", text: "Videos", value: "videos" },
];

const orderoptions = [
  { key: "rating", text: "Rating", value: "Rating" },
  { key: "weight", text: "Weight", value: "Weight" },
  { key: "likes", text: "Likes", value: "Likes" },
  { key: "downloads", text: "Downloads", value: "Downloads" },
  { key: "viewed", text: "Viewed", value: "Viewed" },
  { key: "date", text: "Date", value: "Date" },
  { key: "title", text: "Title", value: "Title" },
  { key: "description", text: "Description", value: "Description" },
];

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKey: "",
      order: "Date",
      trendingTags: [],
      recentTags: [],
      tags: [],
      filteringTags:[],
      selectTag: "",
      searchText: "",
      open: false
    };
    this.handleChangeSearchKey = this.handleChangeSearchKey.bind(this);
    this.handleClickSearch = this.handleClickSearch.bind(this);
    this.handleSelectOrder = this.handleSelectOrder.bind(this);
    this.loadTrendingTags = this.loadTrendingTags.bind(this);
    this.handleClickTag = this.handleClickTag.bind(this);
    this.onSearchChange =  this.onSearchChange.bind(this);
    this.handleClickOption =  this.handleClickOption.bind(this);
    this.openDropdown =  this.openDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
  }

  componentDidMount() {
    var test = [
      {
        label: "key",
        value: "girl with hat",
      },
      {
        label: "tag",
        value: "hat",
      },
    ];
    var searchOptions = "";
    test.forEach((t) => {
      searchOptions = searchOptions + "&" + t.label + "=" + t.value;
    });
    this.loadAllTags();
    this.loadTrendingTags();
  }

  loadAllTags() {
    getAllTags()
      .then((response) => {
        let taglist = response.tags.map((tag) => {
          return {
            key: tag.id,
            value: tag.value,
            text: tag.value,
            icon: tag.icon,
          };
        });
        this.setState({
          tags: taglist,
          filteringTags: taglist
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  loadTrendingTags() {
    this.setState({
      isLoading: true,
    });
    getTrendingTags()
      .then((response) => {
        this.setState({
          trendingTags: response,
        });
        getRecentTags()
          .then((response) => {
            this.setState({
              recentTags: response,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleClickTag(e) {
    this.props.handleSearchTag(e.target.id);
    this.setState({
      selectTag: e.target.id,
      searchText: e.target.id,
      open: false
    });
  }

  onSearchChange(e, {data}){
    var filteringTags = [];
    this.state.tags.forEach(tag=>{
      if(tag.value.includes(e.target.value)){
        filteringTags.push(tag)
      }
    })
    this.setState({
      searchText: e.target.value,
      filteringTags: filteringTags,
      open: true
    })
  }

  openDropdown(){
    this.setState({
      open: true
    })
  }

  closeDropdown(){
    this.setState({
      open: false
    })
  }

  handleClickOption(e){
    console.log(e.target)
  }

  handleChangeSearchKey(e, { value }) {
    this.setState({
      searchKey: value,
    });
    console.log(value);
  }

  handleClickSearch() {
    console.log(this.state.order, this.state.searchKey);

    if (this.state.searchKey != "") {
      var SearchOptions = [
        {
          label: "key",
          value: this.state.searchKey,
        },
      ];
    } else {
      var SearchOptions = [];
    }
    this.props.clickSearch(SearchOptions);
  }

  handleSelectOrder(e, { value }) {
    this.setState({
      order: value,
    });
    console.log(value);
  }

  onChangeSearchDropdown(){
    console.log("changed")
  }

  render() {
    const Trendingkeywords = [];
    this.state.trendingTags.forEach((tag, tagIndex) => {
      Trendingkeywords.push(
        <Label
          as="a"
          className="value"
          id={tag.value}
          image
          onClick={this.handleClickTag}
        >
          <img src={tag.icon} />
          {tag.value}
        </Label>
      );
    });

    const Recentkeywords = [];
    this.state.recentTags.forEach((tag, tagIndex) => {
      Recentkeywords.push(
        <Label
          as="a"
          className="value"
          id={tag.value}
          image
          onClick={this.handleClickTag}
        >
          <img src={tag.icon} />
          {tag.value}
        </Label>
      );
    });
    return (
      <>
        {/* <Input
          className="searchBar"
          type="text"
          placeholder="Search..."
          name="searchKey"
          value={this.state.searchKey}
          onChange={this.handleChangeSearchKey}
          action
        >
          <Select
            className="sele"
            compact
            options={options}
            defaultValue="all"
          />
          <input />
          <Select
            className="sele"
            compact
            options={orderoptions}
            value={this.state.order}
            onChange={this.handleSelectOrder}
          />
          <Button onClick={this.handleClickSearch}>Search</Button>
        </Input> */}
        <Dropdown
          search
          className="searchBar"
          selection
          options={this.state.tags}
          value={this.state.selectTag}
          onSearchChange={this.onSearchChange}
          searchQuery = {this.state.searchText}
          open={this.state.open}
          onFocus={this.openDropdown}
          onBlur = {this.closeDropdown}
        >
          <Dropdown.Menu className="searchBoxContent">
            <Dropdown.Menu scrolling>
              {this.state.filteringTags.map((option) => (
                <Dropdown.Item key={option.value} id={option.value} {...option} onClick={this.handleClickTag} />
              ))}
            </Dropdown.Menu>
            <span>recent tags</span>
            <Grid className="searchItems">
              {Recentkeywords.length > 0 ? Recentkeywords : "No recent tags"}
            </Grid>
            <Dropdown.Divider />
            <span>treding tags</span>
            <Grid className="searchItems">{Trendingkeywords}</Grid>
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  }
}

export default SearchBar;
