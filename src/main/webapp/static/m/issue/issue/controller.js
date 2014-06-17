/**
 * Created by hongxueqian on 14-5-11.
 */


function issue_issue($state) {

}

function issue_issue_mixListPlus($scope, $$issueRes, $$stateProxy, $$issueConfig) {
    return mixListPlusCtrlTmpl($scope, $$issueRes, $$stateProxy, $$issueConfig.issue)
}

function issue_issue_mixListPlus_tabs_detail($scope, $$issueRes, $stateParams, $$issueConfig,$http) {
    $http.get("m/issue/data/issue1.json").success(function (data, status) {
        $scope.issue = data;
    });
    //return mixListPlusTabsDetailCtrlTmpl($scope,$$issueRes,$stateParams,$$issueConfig.issue)
}