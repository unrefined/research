var statuses = [ 'Draft', 'Sent', 'Active', 'Inactive', 'Done' ],
    types = [ 'Email', 'A/B Test', 'Automation', 'Coupon', 'Event' ],
    folders = [ 'Unfiled', 'Spring 2018', 'Holiday 2017', 'Tom' ],
    campaignUnitTemplate = '' +
  '<article class="CampaignUnit" data-folder="{{folderValue}}" data-status="{{statusValue}}" data-type="{{typeValue}}">' +
    '<div class="CampaignUnit-column u-paddingFlush">' +
      '<input type="checkbox" class="Form-checkbox" id="checkbox-test-{{id}}" />' +
      '<label for="checkbox-test-{{id}}" class="u-marginRightHalf"></label>' +
    '</div>' +
    '<div class="CampaignUnit-column u-paddingFlush">' +
      '<img style="height: 80px" src="https://static.ctctcdn.com/ui/images1/campaign-ui/CampaignThumbnail-automation.svg">' +
    '</div>' +
    '<div class="CampaignUnit-column CampaignUnit-column--title u-paddingLeft">' +
      '<h1 class="CampaignUnit-title"><a href="javascript:void(0)">{{name}}</a></h1>' +
        '<h2 class="Tagline">' +
          '<span class="Tagline-status {{statusClass}}"><span>{{status}}</span></span>' +
          '<span class="Tagline-type">{{type}}</span>, created on <span>{{created}}</span>' +
        '</h2>' +
      '</div>' +
      '<div class="CampaignUnit-column u-textRight">' +
        '<div class="Dropdown js-dropdown" data-menu-alignment="right">' +
          '<button type="button" class="Button Dropdown-toggle">' +
            '<span>More</span><span class="Button-caret"></span>' +
          '</button>' +
          '<ul class="Menu">' +
            '<li data-value="Copy"><span>Copy</span></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
    '</article>',


campaigns = [
  {
    name: 'Spring Has Sprung',
    created: 'Apr 23, 2018',
    status: 0,
    type: 0,
    folder: 1
  },
  {
    name: 'Untitled Campaign Created 2018/03/12, 1:48:36 PM',
    created: 'Mar 12, 2018',
    status: 1,
    type: 1,
    folder: 0
  },
  {
    name: 'March Newsletter',
    created: 'Mar 2, 2018',
    status: 1,
    type: 0,
    folder: 0
  },
  {
    name: 'Untitled Campaign Created 2018/01/30, 11:12:53 AM',
    created: 'Jan 30, 2018',
    status: 0,
    type: 0,
    folder: 3
  },
  {
    name: 'Onboarding',
    created: 'Jan 2, 2018',
    status: 3,
    type: 2,
    folder: 3
  },
  {
    name: 'Holiday Sale',
    created: 'Dec 15, 2017',
    status: 0,
    type: 0,
    folder: 2
  },

  {
    name: 'Thanksgiving Coupon',
    created: 'Nov 12, 2017',
    status: 4,
    type: 3,
    folder: 0
  },
  {
    name: 'Halloween Party',
    created: 'Oct 2, 2017',
    status: 4,
    type: 4,
    folder: 3
  },

  {
    name: 'List Join',
    created: 'Feb 12, 2017',
    status: 2,
    type: 2,
    folder: 0
  },
  {
    name: 'Christmas 2016',
    created: 'Nov 30, 2016',
    status: 0,
    type: 1,
    folder: 0
  },
  {
    name: 'Copy of Christmas 2016',
    created: 'Dec 4, 2016',
    status: 1,
    type: 1,
    folder: 0
  },
  {
    name: 'Welcome Email',
    created: 'Aug 21, 2016',
    status: 2,
    type: 2,
    folder: 0
  }
],
currentFilters = [];

$(function(){
  if ( /existing/.test(window.location.href) ) {
    setupLeftFilters();
  } else {
    setupTopFilters()
  }
  populateCampaigns();
});

// SHARED METHODS

// getStatusCount = function () {
//   counts = {};
//   $.each(campaigns, function(i, campaign){
//     var statusText = getStatusText(campaign.status);
//     console.log(campaign);
//         counts[ statusText ] = counts[ statusText ] || 0;
//         counts[ statusText ] = counts[ statusText ] + 1;
//   })
//   return counts;
// };

buildInclusiveSelector = function () {
  var selector = '';
  $.each(window.currentFilters, function (i, filter) {
    if (filter.value) {
      selector += '[data-' + filter.name + '=' + filter.value + ']';
    }
  });
  return selector;
};

filterCampaigns = function () {
  if ( window.currentFilters.length === 0 ){
    $('.CampaignUnit').removeClass('u-hide');
  }  else {
    $('.CampaignUnit').addClass('u-hide');
    $(buildInclusiveSelector()).removeClass('u-hide');
  }

  $('.empty-state').toggleClass('u-hide', $('.CampaignUnit').not('.u-hide').length > 0)

};

getStatusText = function (id) {
  return statuses[id];
};

getStatusClass = function (id) {
  return 'u-color' + statuses[id];
};

getFolderText = function (id) {
  return folders[id];
};

getTypeText = function (id) {
  return types[id];
};

buildCampaignUnit = function(index, campaign) {
  var item = Object.assign({}, campaign);
  item.statusClass = getStatusClass(item.status);
  item.statusValue = getStatusText(item.status).replace(/[\/\s]+/g, '').toLowerCase();
  item.status = getStatusText(item.status);
  item.typeValue = getTypeText(item.type).replace(/[\/\s]+/g, '').toLowerCase();
  item.type = getTypeText(item.type);
  item.folderValue = getFolderText(item.folder).replace(/[\/\s]+/g, '').toLowerCase();
  item.folder = getFolderText(item.folder);
  item.id = index;

  return campaignUnitTemplate.replace(/{{([a-zA-Z0-9]+)}}/g, function(match, p1){
      return item[p1];
    })
}

populateCampaigns = function () {
  $.each(campaigns, function(i, campaign){
    $('.campaign-container').append(buildCampaignUnit(i, campaign));
  })
}

getActiveSectionFilter = function($section, name) {
  return $section.find('.filter-item.is-selected').data('value');
};

getActiveNavFilters = function () {
  var filters = [],
      folder = getActiveSectionFilter( $('#folder_nav') ),
      status = getActiveSectionFilter( $('#status_nav') ),
      type = getActiveSectionFilter( $('#type_nav') );

  folder && filters.push({ name: 'folder', value: folder });
  status && filters.push({ name: 'status', value: status });
  type && filters.push({ name: 'type', value: type });

  window.currentFilters = filters;
};


// TOP FILTER METHODS

setupTopFilters = function () {
  $('body').on('click', '.clear-filters-button', resetFilters);

  buildDropdown( $('#folder_dropdown'), folders, 'Folder', 'All Folders');
  buildDropdown( $('#status_dropdown'), statuses, 'Status', 'All Statuses');
  buildDropdown( $('#type_dropdown'), types, 'Type', 'All Types');

  $('.js-dropdown-select').fedDropdownSelect({
    select: handleSelectDropdownItem
  });
};

handleSelectDropdownItem = function (e, data) {
  getActiveDropdownFilters();
  if (window.currentFilters.length < 1) {
    handleClickAllCampaignsButton();
  }
  filterCampaigns();
}

resetFilters = function() {
  $('#folder_dropdown').fedDropdownSelect('select', '');
  $('#status_dropdown').fedDropdownSelect('select', '');
  $('#type_dropdown').fedDropdownSelect('select', '');
  handleClickAllCampaignsButton();
}

buildDropdown = function($dropdown, items, label, allText){

  $dropdown.find('.Menu').append('<li class="Menu-label">'+ label +'</li><li class="filter-item" data-value=""><a href="javascript:void(0);">' + allText + '</a></li>');
  $.each(items, function(i, item){
    $dropdown.find('.Menu').append(buildItem(item));
  });
};

getActiveDropdownFilters = function () {
  var filters = [],
      folder = $('#folder_dropdown').fedDropdownSelect('getSelectedValue'),
      status = $('#status_dropdown').fedDropdownSelect('getSelectedValue'),
      type = $('#type_dropdown').fedDropdownSelect('getSelectedValue');

  folder && filters.push({ name: 'folder', value: folder });
  status && filters.push({ name: 'status', value: status });
  type && filters.push({ name: 'type', value: type });

  window.currentFilters = filters;
};

// LEFT FILTER METHODS

setupLeftFilters = function () {
  $('.collapsibleGroup-heading').on('click', function(e){
    $(e.currentTarget).closest('.collapsibleGroup').toggleClass('is-open');
  });

  $('body').on('click', '.filter-item', handleSelectNavFilter);
  $('body').on('click', '.all-campaigns', handleClickAllCampaignsButton);
  $('body').on('click', '.clear-filters-button', handleClickAllCampaignsButton);

  buildNavSection( $('#folder_nav'), folders );
  buildNavSection( $('#status_nav'), statuses );
  buildNavSection( $('#type_nav'), types );

  $('#status_nav').addClass('is-open');
};

handleSelectNavFilter = function (e) {
  $('.all-campaigns').removeClass('is-selected');
  $(e.currentTarget).closest('ul').find('.is-selected').not(e.currentTarget).removeClass('is-selected')
  $(e.currentTarget).toggleClass('is-selected');
  getActiveNavFilters();
  if (window.currentFilters.length < 1) {
    handleClickAllCampaignsButton();
  }
  filterCampaigns();
}

handleClickAllCampaignsButton = function () {
  $('.Nav').find('.is-selected').removeClass('is-selected')
  $('.all-campaigns').addClass('is-selected');
  window.currentFilters = [];
  filterCampaigns();
}

buildNavSection = function($section, items){
  $.each(items, function(i, item){
    $section.find('.Nav').append(buildItem(item));
  });
};

buildItem = function(item){
  return $('<li class="filter-item" data-value="' + item.replace(/[\/\s]+/g, '').toLowerCase() + '"><a href="javascript:void(0);">' + item + '</a></li>');
};
