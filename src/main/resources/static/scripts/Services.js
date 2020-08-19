'use strict';

/**
 * @ngdoc function
 * @name CMSAdminApp:Services
 * @description
 * # Services
 * Services of the CMSAdminApp
 */

//app.service('MetadataService', ['$window', function($window){
// var self = this;
// self.setMetaTags = function (tagData){
//   $window.document.getElementsByName('title')[0].content = tagData.title;
//   $window.document.getElementsByName('description')[0].content = tagData.description;
// }; 
//}]);

app.service('DataService', ['$localStorage', '$http', '$filter', function ($localStorage, $http, $filter) {

        /* GET CLIENT IP*/
        var IP = "127.0.0.1";
//    $http.get("https://ipinfo.io/").then(function (response) {
//        IP = response.data.ip;
//    });



        this.logout = function () {
            return $http.post('/logout', {},
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getPageSize = function () {
            var pageSize = localStorage.pageSize === undefined ? 20 : localStorage.getItem('pageSize');
            return pageSize;
        };


        this.getDailySummary = function (numDays) {
            return $http.get(urlBase + 'reports/dashboard/cash-collection-daily?size=' + numDays,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getCollectionSummary = function (filter) {
            var dashboard_filter = filter.dateFrom ? "from=" + $filter('date')(filter.dateFrom, 'yyyy/MM/dd') + "&" : "";
            dashboard_filter = filter.dateTo ? dashboard_filter + "to=" + $filter('date')(filter.dateTo, 'yyyy/MM/dd') + "&" : dashboard_filter;



            return $http.get(urlBase + 'reports/dashboard/cash-collection-summary?' + dashboard_filter,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getCustomerSummary = function () {

            return $http.get(urlBase + 'reports/dashboard/customer-sumary',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getSearchCustAccount = function (accountRef) {
            return $http.get(urlBase + 'principal-customer/account/' + accountRef + '?userIp=' + IP + '&userAgent=Browser/Application',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getCustomerAccounts = function (customerId) {
            return $http.get(urlBase + 'principal-customer/' + customerId + '/accounts?userIp=' + IP + '&userAgent=Browser/Application',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getOutletAccountsByUser = function (outletId) {
            return $http.get(urlBase + 'principal-customer/user-accounts/' + outletId + '?userIp=' + IP + '&userAgent=Browser/Application',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getCustomerContacts = function (customerId) {
            return $http.get(urlBase + 'principal-customer/contacts?customerId=' + customerId + '&userIp=' + IP + '&userAgent=Browser/Application',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getUnapprovedCustomerContacts = function (customerId) {
            return $http.get(urlBase + 'principal-customer/contacts?actionStatus=Unapproved&customerId=' + customerId + '&sort=contactId,desc&userIp=' + IP + '&userAgent=Browser/Application',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.approveOutletContact = function (ContactApprovaldata, ContactApproval) {
            if (ContactApproval === 'approved') {
                return $http.put(urlBase + 'principal-customer/contacts/approve-actions?userIp=' + IP + '&userAgent=Browser/Application', ContactApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else {
                return $http.put(urlBase + 'principal-customer/contacts/decline-actions?userIp=' + IP + '&userAgent=Browser/Application', ContactApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.getCustomerOutlets = function (customerId, loggedInUser) {
            if (loggedInUser) {
                return $http.get(urlBase + 'principal-customer/outlets/for-user?userIp=' + IP + '&userAgent=Browser/Application',
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else if (customerId) {
                return $http.get(urlBase + 'principal-customer/outlets/customer-outlets/' + customerId + '?userIp=' + IP + '&userAgent=Browser/Application&size=99999&page=0',
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else {
                return $http.get(urlBase + 'principal-customer/outlets?userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.getContactOutlets = function (contactId) {
            return $http.get(urlBase + 'principal-customer/outlets/contact-outlets/' + contactId,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        }

        this.linkOutletContact = function (CustomerAccount, CustomerContact) {
            return $http.get(urlBase + 'principal-customer/outlets/' + CustomerAccount + '/contact/' + CustomerAccount + '&userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        }

        this.savePrincipalCustomer = function (Customer) {
            if (Customer.customerId !== undefined) {
                return $http.put(urlBase + 'principal-customer?userIp=' + IP + '&userAgent=Browser/Application', Customer,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else {
                return $http.post(urlBase + 'principal-customer/onboard-customer?userIp=' + IP + '&userAgent=Browser/Application', Customer,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.updateCustomerContact = function (contact) {
            return $http.put(urlBase + 'principal-customer/contacts', contact,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.addNewCustomerAccount = function (BankAccount) {
            return $http.post(urlBase + 'principal-customer/' + BankAccount.customerId + '/account/' + BankAccount.accountNumber + '?userIp=' + IP + '&userAgent=Browser/Application', {},
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.OutletAccounts = function (outletId) {
            return $http.get(urlBase + 'principal-customer/user-accounts/' + outletId,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.addNewCustomercontact = function (CustomerContact) {
            return $http.post(urlBase + 'principal-customer/contacts?userIp=' + IP + '&userAgent=Browser/Application', CustomerContact,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };


        this.approveCustomers = function (CustomerApprovaldata, action) {
            if (action === "approved") {
                return $http.put(urlBase + 'principal-customer/approve-actions?userIp=' + IP + '&userAgent=Browser/Application', CustomerApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else if (action === "rejected") {
                return $http.put(urlBase + 'principal-customer/decline-actions?userIp=' + IP + '&userAgent=Browser/Application', CustomerApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };


        this.searchCustomer = function (keyword, actionStatus) {
            return $http.get(urlBase + 'principal-customer?actionStatus=' + actionStatus + '&' + 'needle=' + angular.lowercase(keyword) + '&sort=customerName&dir=asc&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getCustomers = function (actionStatus, filter) {
            var customer_filter = filter.dateFrom ? "from=" + $filter('date')(filter.dateFrom, 'yyyy/MM/dd') + "&" : "";
            customer_filter = filter.dateTo ? customer_filter + "to=" + $filter('date')(filter.dateTo, 'yyyy/MM/dd') + "&" : customer_filter;
            customer_filter = filter.keyword ? customer_filter + "needle=" + filter.keyword + "&" : customer_filter;
            customer_filter = filter.custCategoryId ? customer_filter + "categoryId=" + filter.custCategoryId + "&" : customer_filter;
            customer_filter = (filter.subscriptionStatus && filter.subscriptionStatus !== 'All') ? customer_filter + "status=" + filter.subscriptionStatus + "&" : customer_filter;
            customer_filter = (filter.approvalStatus && filter.approvalStatus !== 'All') ? customer_filter + "actionStatus=" + filter.approvalStatus + "&" : customer_filter;

            if (actionStatus) {
                return $http.get(urlBase + 'principal-customer?sort=customerId,desc&actionStatus=' + actionStatus + '&' + customer_filter + 'userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else {
                return $http.get(urlBase + 'principal-customer?sort=customerId,desc&' + customer_filter + 'userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };


        this.getCustomerListDoc = function (actionStatus, filter, outputFormat) {
            var customer_filter = filter.dateFrom ? "from=" + $filter('date')(filter.dateFrom, 'yyyy/MM/dd') + "&" : "";
            customer_filter = filter.dateTo ? customer_filter + "to=" + $filter('date')(filter.dateTo, 'yyyy/MM/dd') + "&" : customer_filter;
            customer_filter = filter.keyword ? customer_filter + "needle=" + filter.keyword + "&" : customer_filter;
            customer_filter = filter.custCategoryId ? customer_filter + "categoryId=" + filter.custCategoryId + "&" : customer_filter;
            customer_filter = (filter.subscriptionStatus && filter.subscriptionStatus !== 'All') ? customer_filter + "status=" + filter.subscriptionStatus + "&" : customer_filter;
            customer_filter = (filter.approvalStatus && filter.approvalStatus !== 'All') ? customer_filter + "actionStatus=" + filter.approvalStatus + "&" : customer_filter;

            if (actionStatus) {
                window.location = urlBase + 'principal-customer/export.' + outputFormat + '?access_token=' + $localStorage.accessToken + '&sort=customerId,desc&actionStatus=' + actionStatus + '&' + customer_filter + 'userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber;

            } else {
                window.location = urlBase + 'principal-customer/export.' + outputFormat + '?access_token=' + $localStorage.accessToken + '&sort=customerId,desc&' + customer_filter + 'userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber;

            }
        };

        this.getCustomerChanges = function (customerId) {
            return $http.get(urlBase + 'principal-customer/' + customerId + '/changes',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        }

        this.saveCITAgent = function (CITAgent) {
            if (CITAgent.citAgentId !== undefined) {
                return $http.put(urlBase + 'cit_agent/update_cit_agent?userIp=' + IP + '&userAgent=Browser/Application', CITAgent,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else {
                return $http.post(urlBase + 'cit_agent/add_cit_agent?userIp=' + IP + '&userAgent=Browser/Application', CITAgent,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.approveCITAgents = function (CITAgentApprovaldata, action) {
            if (action === "approved") {
                return $http.put(urlBase + 'cit_agent/approve-actions?userIp=' + IP + '&userAgent=Browser/Application', CITAgentApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else if (action === "rejected") {
                return $http.put(urlBase + 'cit_agent/decline-actions?userIp=' + IP + '&userAgent=Browser/Application', CITAgentApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.deactivateCIT = function (deactivateCITData, status) {
            if (status === 'Active') {
                return $http.put(urlBase + 'cit_agent/deactivate?userIp=' + IP + '&userAgent=Browser/Application', deactivateCITData,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else if (status === 'Inactive') {
                return $http.put(urlBase + 'cit_agent/activate?userIp=' + IP + '&userAgent=Browser/Application', deactivateCITData,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.deleteCIT = function (deleteCITData) {
            return $http.delete(urlBase + 'cit_agent?userIp=' + IP + '&userAgent=Browser/Application',
                    {
                        headers: {'X-CSRF-TOKEN': hValue, 'Content-Type': 'application/json'},
                        data: deleteCITData
                    });
        };

        this.getCITAgents = function (actionStatus, filter) {
//        var citAgent_filter = filter.dateFrom ? "from="+$filter('date')(filter.dateFrom, 'yyyy/MM/dd')+"&" : ""; 
//        citAgent_filter = filter.dateTo ? citAgent_filter+"to="+$filter('date')(filter.dateTo, 'yyyy/MM/dd')+"&" : citAgent_filter;
            var citAgent_filter = filter.keyword ? citAgent_filter + "needle=" + filter.keyword + "&" : citAgent_filter;
            citAgent_filter = (filter.approvalStatus && filter.approvalStatus !== 'All') ? citAgent_filter + "actionStatus=" + filter.approvalStatus + "&" : citAgent_filter;
            citAgent_filter = (filter.subscriptionStatus && filter.subscriptionStatus !== 'All') ? citAgent_filter + "status=" + filter.subscriptionStatus + "&" : citAgent_filter;
            if (actionStatus) {
                return $http.get(urlBase + 'cit_agent?sort=creationDate,desc&status=Active&' + 'actionStatus=' + actionStatus + '&' + citAgent_filter + '&userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else {
                return $http.get(urlBase + 'cit_agent/get_cit_agents?sort=citAgentId,desc&' + citAgent_filter,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.getCitAgentListDoc = function (actionStatus, filter, outputFormat) {
//        var citAgent_filter = filter.dateFrom ? "from="+$filter('date')(filter.dateFrom, 'yyyy/MM/dd')+"&" : ""; 
//        citAgent_filter = filter.dateTo ? citAgent_filter+"to="+$filter('date')(filter.dateTo, 'yyyy/MM/dd')+"&" : citAgent_filter;
            var citAgent_filter = filter.keyword ? citAgent_filter + "needle=" + filter.keyword + "&" : citAgent_filter;
            citAgent_filter = (filter.approvalStatus && filter.approvalStatus !== 'All') ? citAgent_filter + "actionStatus=" + filter.approvalStatus + "&" : citAgent_filter;
            citAgent_filter = (filter.subscriptionStatus && filter.subscriptionStatus !== 'All') ? citAgent_filter + "status=" + filter.subscriptionStatus + "&" : citAgent_filter;
            if (actionStatus) {

                window.location = urlBase + 'cit_agent/export.' + outputFormat + '?access_token=' + $localStorage.accessToken + '&sort=creationDate,desc&status=Active&' + 'actionStatus=' + actionStatus + '&' + citAgent_filter + '&userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber;

            } else {
                window.location = urlBase + 'cit_agent/export.' + outputFormat + '?access_token=' + $localStorage.accessToken + '&sort=citAgentId,desc&' + citAgent_filter;
            }
        };



        this.getCitAgentChanges = function (citAgentId) {
            return $http.get(urlBase + 'cit_agent/' + citAgentId + '/changes',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        }

        this.searchCITA = function (keyword) {
            return $http.get(urlBase + 'cit_agent/get_cit_agents?needle=' + angular.lowercase(keyword) + '&sort=citAgentName&dir=asc&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.uploadFile = function (FileUpload, fileCategory) {
            if (fileCategory === 'CIT Agent Crew') {
                return $http.post(urlBase + 'batchfiles/upload_cit_agents?userIp=' + IP + '&userAgent=Browser/Application', FileUpload,
                        {
                            headers: {'X-CSRF-TOKEN': hValue, 'Content-Type': undefined}
                        });
            } else {
                return $http.post(urlBase + 'batchfiles/upload-vehicles?userIp=' + IP + '&userAgent=Browser/Application', FileUpload,
                        {
                            headers: {'X-CSRF-TOKEN': hValue, 'Content-Type': undefined}
                        });
            }
        };

        this.getBatchFiles = function (filter) {
            var batchFile_filter = filter.dateFrom ? "from=" + $filter('date')(filter.dateFrom, 'yyyy/MM/dd') + "&" : "";
            batchFile_filter = filter.dateTo ? batchFile_filter + "to=" + $filter('date')(filter.dateTo, 'yyyy/MM/dd') + "&" : batchFile_filter;
            batchFile_filter = filter.keyword ? batchFile_filter + "needle=" + filter.keyword + "&" : batchFile_filter;
            batchFile_filter = (filter.approvalStatus && filter.approvalStatus !== 'All') ? batchFile_filter + "status=" + filter.approvalStatus + "&" : batchFile_filter;
            batchFile_filter = (filter.userType && filter.userType !== 'All') ? batchFile_filter + "categoryId=" + filter.userType + "&" : batchFile_filter;
            return $http.get(urlBase + 'batchfiles/uploaded_files?sort=batchId,desc&' + batchFile_filter + 'userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getCITCrew = function (actionStatus, filter) {
            var CitCrew_filter = filter.keyword ? "needle=" + filter.keyword : "";

            if (actionStatus) {
                return $http.get(urlBase + 'cit_agent_crew?sort=crewId,desc&actionStatus=' + actionStatus + '&' + CitCrew_filter + '&userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else {
                return $http.get(urlBase + 'cit_agent_crew?sort=crewId,desc&' + CitCrew_filter + '&userIp=' + IP + '&userAgent=Browser/Application&sort=creationDate&dir=desc&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.getCITCrewListDoc = function (actionStatus, filter, outputFormat) {
            var CitCrew_filter = filter.keyword ? "needle=" + filter.keyword : "";

            if (actionStatus) {

                window.location = urlBase + 'cit_agent_crew/export.' + outputFormat + '?access_token=' + $localStorage.accessToken + '&sort=crewId,desc&actionStatus=' + actionStatus + '&' + CitCrew_filter + '&userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber;

            } else {

                window.location = urlBase + 'cit_agent_crew/export.' + outputFormat + '?access_token=' + $localStorage.accessToken + '&sort=crewId,desc&' + CitCrew_filter + '&userIp=' + IP + '&userAgent=Browser/Application&sort=creationDate&dir=desc&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber

            }
        };

        this.getCitCrewChanges = function (crewId) {
            return $http.get(urlBase + 'cit_agent_crew/' + crewId + '/changes',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        }

        this.searchCITCrew = function (keyword, categoryId) {
            return $http.get(urlBase + 'cit_agent_crew/category/' + categoryId + '/search?needle=' + angular.lowercase(keyword) + '&sort=fullName&dir=asc&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getCITCrewByBatchID = function (batchID) {
            return $http.get(urlBase + 'cit_agent_crew/batch_file_id/' + batchID + '?userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.confirmCITCrew = function (CITCrewConfirmdata) {
            return $http.put(urlBase + 'cit_agent_crew/approve-actions?userIp=' + IP + '&userAgent=Browser/Application', CITCrewConfirmdata,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.approveCITCrew = function (CITCrewApprovaldata, action) {
            if (action === "approved") {
                return $http.put(urlBase + 'cit_agent_crew/approve-actions?userIp=' + IP + '&userAgent=Browser/Application', CITCrewApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else if (action === "rejected") {
                return $http.put(urlBase + 'cit_agent_crew/decline-actions?userIp=' + IP + '&userAgent=Browser/Application', CITCrewApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.saveCITAgentCrew = function (CITCrews) {
            if (CITCrews.crewId !== undefined) {
                return $http.put(urlBase + 'cit_agent_crew?userIp=' + IP + '&userAgent=Browser/Application', CITCrews,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };


        this.deleteCITCrew = function (deleteCITData) {
            return $http.delete(urlBase + 'cit_agent_crew?userIp=' + IP + '&userAgent=Browser/Application',
                    {
                        headers: {'X-CSRF-TOKEN': hValue, 'Content-Type': 'application/json'},
                        data: deleteCITData
                    });
        };

        this.getCrewCategories = function (fetchAll) {
            var pagenationParams = fetchAll ? '&size=99999&page=0' : '&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber;
            return $http.get(urlBase + 'crew_category/all_crew_categories?userIp=' + IP + '&userAgent=Browser/Application' + pagenationParams,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.searchCITVehicle = function (keyword, category) {
            return $http.get(urlBase + 'cit-agent-vehicles/category/' + category + '/search?needle=' + angular.lowercase(keyword) + '&sort=regNumber&dir=asc&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getCITVehicles = function (actionStatus, filter) {
            var CitVehicle_filter = filter.keyword ? "needle=" + filter.keyword : "";

            if (actionStatus) {
                return $http.get(urlBase + 'cit-agent-vehicles?sort=vehicleId,desc&actionStatus=' + actionStatus + '&' + CitVehicle_filter + '&userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else {
                return $http.get(urlBase + 'cit-agent-vehicles?sort=vehicleId,desc&' + CitVehicle_filter + '&userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.getCITVehiclesListDoc = function (actionStatus, filter, outputFormat) {
            var CitVehicle_filter = filter.keyword ? "needle=" + filter.keyword : "";

            if (actionStatus) {

                window.location = urlBase + 'cit-agent-vehicles/export.' + outputFormat + '?access_token=' + $localStorage.accessToken + '&sort=vehicleId,desc&actionStatus=' + actionStatus + '&' + CitVehicle_filter + '&userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber;
            } else {

                window.location = urlBase + 'cit-agent-vehicles/export.' + outputFormat + '?access_token=' + $localStorage.accessToken + '&sort=vehicleId,desc&' + CitVehicle_filter + '&userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber;

            }
        };

        this.getCitVehicleChanges = function (vehicleId) {
            return $http.get(urlBase + 'cit-agent-vehicles/' + vehicleId + '/changes',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        }

        this.getCITVehicleByBatchID = function (batchID) {
            return $http.get(urlBase + 'cit_agent_crew/batch_file_id/' + batchID + '?userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.confirmCITVehicles = function (CITVehicleConfirmdata) {
            return $http.put(urlBase + 'cit-agent-vehicles/approve-actions?userIp=' + IP + '&userAgent=Browser/Application', CITVehicleConfirmdata,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.approveCITVehicles = function (CITVehicleApprovaldata, action) {
            if (action === "approved") {
                return $http.put(urlBase + 'cit-agent-vehicles/approve-actions?userIp=' + IP + '&userAgent=Browser/Application', CITVehicleApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else if (action === "rejected") {
                return $http.put(urlBase + 'cit-agent-vehicles/decline-actions?userIp=' + IP + '&userAgent=Browser/Application', CITVehicleApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.deleteCITCrewVehicle = function (deleteCITVehicleData) {
            return $http.delete(urlBase + 'cit-agent-vehicles?userIp=' + IP + '&userAgent=Browser/Application',
                    {
                        headers: {'X-CSRF-TOKEN': hValue, 'Content-Type': 'application/json'},
                        data: deleteCITVehicleData
                    });
        };

        this.submitCollectionRequest = function (CashCollectionRequest) {
            return $http.post(urlBase + 'cash-collection?userIp=' + IP + '&userAgent=Browser/Application', CashCollectionRequest,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.submitOfflineRequest = function (OfflineCollectionRequest) {
            return $http.post(urlBase + 'cash-collection/offline-collection?userIp=' + IP + '&userAgent=Browser/Application', OfflineCollectionRequest,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };


        this.getPendingCollectionRequests = function (customerId, requestStage, filter, requestStatus, outputFormat) {
            var collection_filter = filter.dateFrom ? "from=" + $filter('date')(filter.dateFrom, 'yyyy/MM/dd') + "&" : "";
            collection_filter = filter.dateTo ? collection_filter + "to=" + $filter('date')(filter.dateTo, 'yyyy/MM/dd') + "&" : collection_filter;
            collection_filter = filter.keyword ? collection_filter + "needle=" + filter.keyword + "&" : collection_filter;
            collection_filter = (filter.requestStatus && filter.requestStatus !== 'All') ? collection_filter + "requestStatus=" + filter.requestStatus + "&" : collection_filter;
            if (requestStage) {
                collection_filter = collection_filter + "requestStage=" + requestStage + "&";
            } else {
                collection_filter = (filter.requestStage && filter.requestStage !== 'All') ? collection_filter + "requestStage=" + filter.requestStage + "&" : collection_filter;
            }

            var export_report = outputFormat ? '' + outputFormat : '';
            if (customerId) {
                return $http.get(urlBase + 'cash-collection/customer-requests/' + customerId + '?requestStatus=' + requestStatus + '&sort=requestTime,desc&userIp=' + IP + '&userAgent=Browser/Application&sort=requestTime&dir=desc&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else {
                return $http.get(urlBase + 'cash-collection/report' + export_report + '?requestStatus=' + requestStatus + '&sort=requestTime,desc&' + collection_filter + 'userIp=' + IP + '&userAgent=Browser/Application&sort=&dir=&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.getCollectionRequestsListDoc = function (customerId, requestStage, filter, requestStatus, outputFormat) {
            var collection_filter = filter.dateFrom ? "from=" + $filter('date')(filter.dateFrom, 'yyyy/MM/dd') + "&" : "";
            collection_filter = filter.dateTo ? collection_filter + "to=" + $filter('date')(filter.dateTo, 'yyyy/MM/dd') + "&" : collection_filter;
            collection_filter = filter.keyword ? collection_filter + "needle=" + filter.keyword + "&" : collection_filter;
            collection_filter = (filter.requestStatus && filter.requestStatus !== 'All') ? collection_filter + "requestStatus=" + filter.requestStatus + "&" : collection_filter;
            if (requestStage) {
                collection_filter = collection_filter + "requestStage=" + requestStage + "&";
            } else {
                collection_filter = (filter.requestStage && filter.requestStage !== 'All') ? collection_filter + "requestStage=" + filter.requestStage + "&" : collection_filter;
            }

            var export_report = outputFormat ? '' + outputFormat : '';
//        if(customerId) {

            window.location = urlBase + 'cash-collection/report.' + outputFormat + '?access_token=' + $localStorage.accessToken + '&requestStatus=' + requestStatus + '&sort=requestTime,desc&' + collection_filter + 'userIp=' + IP + '&userAgent=Browser/Application&sort=&dir=&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber;
//            return $http.get(urlBase + 'cash-collection/customer-requests/'+customerId+'?requestStatus='+requestStatus+'&sort=requestTime,desc&userIp='+IP+'&userAgent=Browser/Application&sort=requestTime&dir=desc&size='+$localStorage.pageSize+'&page='+$localStorage.pageNumber, 
//            {
//                headers: { 'X-CSRF-TOKEN':  hValue }
//            });
//        } else {
//            return $http.get(urlBase + 'cash-collection/report.'+outputFormat+'?access_token='+$localStorage.accessToken+'&requestStatus='+requestStatus+'&sort=requestTime,desc&'+collection_filter+'userIp='+IP+'&userAgent=Browser/Application&sort=&dir=&size='+$localStorage.pageSize+'&page='+$localStorage.pageNumber, 
//            {
//                headers: { 'X-CSRF-TOKEN':  hValue }
//            });
//        }
        };


        this.getCollectionRequests = function (customerId, requestStage, filter, requestStatus, outputFormat) {
            var collection_filter = filter.dateFrom ? "from=" + $filter('date')(filter.dateFrom, 'yyyy/MM/dd') + "&" : "";
            collection_filter = filter.dateTo ? collection_filter + "to=" + $filter('date')(filter.dateTo, 'yyyy/MM/dd') + "&" : collection_filter;
            collection_filter = filter.keyword ? collection_filter + "needle=" + filter.keyword + "&" : collection_filter;
            collection_filter = (filter.requestStatus && filter.requestStatus !== 'All') ? collection_filter + "requestStatus=" + filter.requestStatus + "&" : collection_filter;
            if (requestStage) {
                collection_filter = collection_filter + "requestStage=" + requestStage + "&";
            } else {
                collection_filter = (filter.requestStage && filter.requestStage !== 'All') ? collection_filter + "requestStage=" + filter.requestStage + "&" : collection_filter;
            }

            var export_report = outputFormat ? '' + outputFormat : '';
            if (customerId) {
                return $http.get(urlBase + 'cash-collection/customer-requests/' + customerId + '?requestStatus=' + requestStatus + '&sort=requestTime,desc&userIp=' + IP + '&userAgent=Browser/Application&sort=requestTime&dir=desc&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else {
                return $http.get(urlBase + 'cash-collection/report' + export_report + '?requestStatus=' + requestStatus + '&sort=requestTime,desc&' + collection_filter + 'userIp=' + IP + '&userAgent=Browser/Application&sort=&dir=&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.getCollectionRequestDetails = function (requestId) {
            return $http.get(urlBase + 'cash-collection/' + requestId + '?userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.forwardRequest = function (CollectionRequest) {
            return $http.put(urlBase + 'cash-collection/' + CollectionRequest.requestId + '/forward?sort=creationTime,desc&citAgentId=' + CollectionRequest.citAgentId + '&notes=' + CollectionRequest.notes + '&userIp=' + IP + '&userAgent=Browser/Application', {},
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.scheduleCITCrew = function (CITCrewAllocation) {
            return $http.post(urlBase + 'cash-collection/schedule-crew?userIp=' + IP + '&userAgent=Browser/Application', CITCrewAllocation,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.confirmCITCrewschedule = function (CITCrewAllocation) {
            return $http.put(urlBase + 'cash-collection/schedule-crew/' + CITCrewAllocation.requestCrewId + '/approve?notes=' + CITCrewAllocation.notes + '&userIp=' + IP + '&userAgent=Browser/Application', {},
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.inputTally = function (TalliedInput) {
            return $http.post(urlBase + 'cash-collection/transactions/denominations?userIp=' + IP + '&userAgent=Browser/Application', TalliedInput,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.confirmCollectionTrx = function (CollectionTransaction, requestId) {
            return $http.put(urlBase + 'cash-collection/' + requestId + '/confirm?notes=' + CollectionTransaction.notes + '&userIp=' + IP + '&userAgent=Browser/Application', {},
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.amendTrxAmount = function (CollectionTransaction) {
            var transaction = {};
            transaction.accountNumber = CollectionTransaction.accountNumber;
            transaction.currencyCode = CollectionTransaction.currencyCode.currencyCode;
            transaction.trxValue = CollectionTransaction.trxValue;
            return $http.put(urlBase + 'cash-collection/transactions/' + CollectionTransaction.trxId + '?userIp=' + IP + '&userAgent=Browser/Application', transaction,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.cancelRequest = function (CollectionRequest) {
            return $http.put(urlBase + 'cash-collection/' + CollectionRequest.requestId + '/cancel-request?reasons=' + CollectionRequest.reason + '&userIp=' + IP + '&userAgent=Browser/Application', {},
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getRequestReports = function (requestStatus, filter, outputFormat) {
            var collection_filter = filter.dateFrom ? "from=" + $filter('date')(filter.dateFrom, 'yyyy/MM/dd') + "&" : "";
            collection_filter = filter.dateTo ? collection_filter + "to=" + $filter('date')(filter.dateTo, 'yyyy/MM/dd') + "&" : collection_filter;
            collection_filter = filter.keyword ? collection_filter + "needle=" + filter.keyword + "&" : collection_filter;
            collection_filter = (filter.requestStage && filter.requestStage !== 'All') ? collection_filter + "requestStage=" + filter.requestStage + "&" : collection_filter;


            switch (requestStatus) {
                case 'Pending':
                    collection_filter = collection_filter + "requestStatus=Pending&";
                    break;
                case 'Completed':
                    collection_filter = collection_filter + "requestStatus=Completed&";
                    break;
                case 'Cancelled':
                    collection_filter = collection_filter + "requestStatus=Cancelled&";
                    break;
                case 'Ammended':

                    break;
                case 'Offline':
                    collection_filter = collection_filter + "requestStatus=Completed&requestType=Offline&";
                    break;
                default:
                    collection_filter = (filter.requestStatus && filter.requestStatus !== 'All') ? collection_filter + "requestStatus=" + filter.requestStatus + "&" : collection_filter;
                    break;
            }

            var export_report = outputFormat ? '' + outputFormat : '';
            return $http.get(urlBase + 'cash-collection/report' + export_report + '?sort=requestTime,desc&' + collection_filter + 'userIp=' + IP + '&userAgent=Browser/Application&sort=&dir=&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getRequestReportsListDoc = function (requestStatus, filter, outputFormat) {
            var collection_filter = filter.dateFrom ? "from=" + $filter('date')(filter.dateFrom, 'yyyy/MM/dd') + "&" : "";
            collection_filter = filter.dateTo ? collection_filter + "to=" + $filter('date')(filter.dateTo, 'yyyy/MM/dd') + "&" : collection_filter;
            collection_filter = filter.keyword ? collection_filter + "needle=" + filter.keyword + "&" : collection_filter;
            collection_filter = (filter.requestStage && filter.requestStage !== 'All') ? collection_filter + "requestStage=" + filter.requestStage + "&" : collection_filter;


            switch (requestStatus) {
                case 'Pending':
                    collection_filter = collection_filter + "requestStatus=Pending&";
                    break;
                case 'Completed':
                    collection_filter = collection_filter + "requestStatus=Completed&";
                    break;
                case 'Cancelled':
                    collection_filter = collection_filter + "requestStatus=Cancelled&";
                    break;
                case 'Ammended':

                    break;
                case 'Offline':
                    collection_filter = collection_filter + "requestStatus=Completed&requestType=Offline&";
                    break;
                default:
                    collection_filter = (filter.requestStatus && filter.requestStatus !== 'All') ? collection_filter + "requestStatus=" + filter.requestStatus + "&" : collection_filter;
                    break;
            }

            window.location = urlBase + 'cash-collection/report.' + outputFormat + '?access_token=' + $localStorage.accessToken + '&sort=requestTime,desc&' + collection_filter + 'userIp=' + IP + '&userAgent=Browser/Application&sort=&dir=&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber;

        };



        this.getTransactionReports = function (trxStatus, filter, outputFormat) {
            var transaction_filter = filter.dateFrom ? "from=" + $filter('date')(filter.dateFrom, 'yyyy/MM/dd') + "&" : "";
            transaction_filter = filter.dateTo ? transaction_filter + "to=" + $filter('date')(filter.dateTo, 'yyyy/MM/dd') + "&" : transaction_filter;
            transaction_filter = filter.keyword ? transaction_filter + "needle=" + filter.keyword + "&" : transaction_filter;

            switch (trxStatus) {
                case 'Pending':
                    transaction_filter = transaction_filter + "status=Pending&";
                    break;
                case 'Successful':
                    transaction_filter = transaction_filter + "status=Completed&";
                    break;
                case 'Cancelled':
                    transaction_filter = transaction_filter + "status=Cancelled&";
                    break;
                default:
                    transaction_filter = (filter.trxStatus && filter.trxStatus !== 'All') ? transaction_filter + "status=" + filter.trxStatus + "&" : transaction_filter;
                    break;
            }

            var export_report = outputFormat ? '' + outputFormat : '';
            return $http.get(urlBase + 'cash-collection/transactions' + export_report + '?sort=timeInitiated,desc&' + transaction_filter + 'userIp=' + IP + '&userAgent=Browser/Application&sort=&dir=&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getTransactionReportsListDoc = function (trxStatus, filter, outputFormat) {
            var transaction_filter = filter.dateFrom ? "from=" + $filter('date')(filter.dateFrom, 'yyyy/MM/dd') + "&" : "";
            transaction_filter = filter.dateTo ? transaction_filter + "to=" + $filter('date')(filter.dateTo, 'yyyy/MM/dd') + "&" : transaction_filter;
            transaction_filter = filter.keyword ? transaction_filter + "needle=" + filter.keyword + "&" : transaction_filter;

            switch (trxStatus) {
                case 'Pending':
                    transaction_filter = transaction_filter + "status=Pending&";
                    break;
                case 'Successful':
                    transaction_filter = transaction_filter + "status=Completed&";
                    break;
                case 'Cancelled':
                    transaction_filter = transaction_filter + "status=Cancelled&";
                    break;
                default:
                    transaction_filter = (filter.trxStatus && filter.trxStatus !== 'All') ? transaction_filter + "status=" + filter.trxStatus + "&" : transaction_filter;
                    break;
            }

            window.location = urlBase + 'cash-collection/transactions.' + outputFormat + '?access_token=' + $localStorage.accessToken + '&sort=timeInitiated,desc&' + transaction_filter + 'userIp=' + IP + '&userAgent=Browser/Application&sort=&dir=&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber
//        var export_report = outputFormat ? ''+outputFormat : '';
//        return $http.get(urlBase + 'cash-collection/transactions'+export_report+'?sort=timeInitiated,desc&'+transaction_filter+'userIp='+IP+'&userAgent=Browser/Application&sort=&dir=&size='+$localStorage.pageSize+'&page='+$localStorage.pageNumber, 
//        {
//            headers: { 'X-CSRF-TOKEN':  hValue }
//        });
        };




        this.getMessageTemplate = function (actionStatus) {
            if (actionStatus) {
                return $http.get(urlBase + 'message-templates?sort=templateId,desc&actionStatus=Unapproved&userIp=' + IP + '&userAgent=Browser/Application&sort=&dir=&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });

            } else {
                return $http.get(urlBase + 'message-templates?sort=templateId,desc&userIp=' + IP + '&userAgent=Browser/Application&sort=&dir=&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.getTemplateChanges = function (templateId) {
            return $http.get(urlBase + 'message-templates/' + templateId + '/changes',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        }

        this.approveTemplate = function (TemplateApprovaldata, action) {
            if (action === "approved") {
                return $http.put(urlBase + 'message-templates/approve-actions?userIp=' + IP + '&userAgent=Browser/Application', TemplateApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else if (action === "rejected") {
                return $http.put(urlBase + 'message-templates/decline-actions?userIp=' + IP + '&userAgent=Browser/Application', TemplateApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.saveMTemplate = function (tmp) {

            return $http.put(urlBase + '/message-templates?userIp=' + IP + '&userAgent=Browser/Application', tmp,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });

        };


        this.getCustomerPerformanceReport = function (filter, outputFormat) {

            var query_filter = filter.dateFrom ? "from=" + $filter('date')(filter.dateFrom, 'yyyy/MM/dd') + "&" : "";
            query_filter = filter.dateTo ? query_filter + "to=" + $filter('date')(filter.dateTo, 'yyyy/MM/dd') + "&" : query_filter;
            query_filter = filter.customerId ? query_filter + "customerId=" + filter.customerId + "&" : query_filter;

            var export_report = outputFormat ? '/' + outputFormat : '';
            return $http.get(urlBase + 'reports/customer-performance' + export_report + '?' + query_filter + 'userIp=' + IP + '&userAgent=Browser/Application&sort=&dir=&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getCustomerPerformanceReportListDoc = function (filter, outputFormat) {

            var query_filter = filter.dateFrom ? "from=" + $filter('date')(filter.dateFrom, 'yyyy/MM/dd') + "&" : "";
            query_filter = filter.dateTo ? query_filter + "to=" + $filter('date')(filter.dateTo, 'yyyy/MM/dd') + "&" : query_filter;
            query_filter = filter.customerId ? query_filter + "customerId=" + filter.customerId + "&" : query_filter;


            window.location = urlBase + 'reports/customer-performance/export.' + outputFormat + '?access_token=' + $localStorage.accessToken + '&' + query_filter + 'userIp=' + IP + '&userAgent=Browser/Application&sort=&dir=&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber;
//        var export_report = outputFormat ? '/'+outputFormat : '';                
//        return $http.get(urlBase + 'reports/customer-performance'+export_report+'?'+query_filter+'userIp='+IP+'&userAgent=Browser/Application&sort=&dir=&size='+$localStorage.pageSize+'&page='+$localStorage.pageNumber, 
//        {
//            headers: { 'X-CSRF-TOKEN':  hValue }
//        });
        };

        this.getCITAgentPerformanceReport = function (filter, outputFormat) {
            var query_filter = filter.dateFrom ? "from=" + $filter('date')(filter.dateFrom, 'yyyy/MM/dd') + "&" : "";
            query_filter = filter.dateTo ? query_filter + "to=" + $filter('date')(filter.dateTo, 'yyyy/MM/dd') + "&" : query_filter;
            query_filter = filter.citAgentId ? query_filter + "citAgentId=" + filter.citAgentId + "&" : query_filter;

            var export_report = outputFormat ? '/' + outputFormat : '';
            return $http.get(urlBase + 'cit_agent/performance-report' + export_report + '?' + query_filter + 'userIp=' + IP + '&userAgent=Browser/Application&sort=&dir=&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getCITAgentPerformanceReportListDoc = function (filter, outputFormat) {
            var query_filter = filter.dateFrom ? "from=" + $filter('date')(filter.dateFrom, 'yyyy/MM/dd') + "&" : "";
            query_filter = filter.dateTo ? query_filter + "to=" + $filter('date')(filter.dateTo, 'yyyy/MM/dd') + "&" : query_filter;
            query_filter = filter.citAgentId ? query_filter + "citAgentId=" + filter.citAgentId + "&" : query_filter;

            window.location = urlBase + 'cit_agent/performance-report/export.' + outputFormat + '?access_token=' + $localStorage.accessToken + '&' + query_filter + 'userIp=' + IP + '&userAgent=Browser/Application&sort=&dir=&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber;

//        var export_report = outputFormat ? '/'+outputFormat : '';
//        return $http.get(urlBase + 'cit_agent/performance-report'+export_report+'?'+query_filter+'userIp='+IP+'&userAgent=Browser/Application&sort=&dir=&size='+$localStorage.pageSize+'&page='+$localStorage.pageNumber, 
//        {
//            headers: { 'X-CSRF-TOKEN':  hValue }
//        });
        };

        this.saveUser = function (SystemUser) {
            if (SystemUser.userId !== undefined) {
                return $http.put(urlBase + 'users?userIp=' + IP + '&userAgent=Browser/Application', SystemUser,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else {
                return $http.post(urlBase + 'users?userIp=' + IP + '&userAgent=Browser/Application', SystemUser,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.approveUsers = function (UserApprovaldata, action) {
            if (action === "approved") {
                return $http.put(urlBase + 'users/approve-actions?userIp=' + IP + '&userAgent=Browser/Application', UserApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else if (action === "rejected") {
                return $http.put(urlBase + 'users/decline-actions?userIp=' + IP + '&userAgent=Browser/Application', UserApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.assignUserRoles = function (SystemUser) {
            return $http.put(urlBase + 'users/' + SystemUser.userId + '/assign-roles?userIp=' + IP + '&userAgent=Browser/Application', SystemUser.roleIds,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.searchUser = function (keyword) {
            return $http.get(urlBase + 'users/search?needle=' + angular.lowercase(keyword) + '&sort=fullName&dir=asc&size=' + $localStorage.pageSize + '&page=0',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getUsers = function (actionStatus, filter) {
            var users_filter = filter.keyword ? "needle=" + filter.keyword + "&" : "";
            users_filter = filter.userType ? users_filter + "userType=" + filter.userType + "&" : users_filter;
            users_filter = (filter.userStatus && filter.userStatus !== 'All') ? users_filter + "status=" + filter.userStatus + "&" : users_filter;
            users_filter = (filter.approvalStatus && filter.approvalStatus !== 'All') ? users_filter + "actionStatus=" + filter.approvalStatus + "&" : users_filter;
            if (actionStatus) {
                return $http.get(urlBase + 'users?sort=userId,desc&actionStatus=Unapproved&' + users_filter + '&userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else {
                return $http.get(urlBase + 'users?sort=userId,desc&' + users_filter + 'userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };


        this.getUserChanges = function (userId) {
            return $http.get(urlBase + 'users/' + userId + '/changes',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        }

        this.deleteUSER = function (deleteSystemUserData) {
            return $http.delete(urlBase + 'users?userIp=' + IP + '&userAgent=Browser/Application',
                    {
                        headers: {'X-CSRF-TOKEN': hValue, 'Content-Type': 'application/json'},
                        data: deleteSystemUserData
                    });
        };

        this.lockUSER = function (lockSystemUserData, passwordStatus) {
            if (passwordStatus === null || passwordStatus === 'Active' || passwordStatus === 'Expired') {
                return $http.put(urlBase + 'users/lock?userIp=' + IP + '&userAgent=Browser/Application', lockSystemUserData,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else if (passwordStatus === 'Locked') {
                return $http.put(urlBase + 'users/unlock?userIp=' + IP + '&userAgent=Browser/Application', lockSystemUserData,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.deactivateUSER = function (deactivateSystemUserData, status) {
            if (status === 'Active' || status === 'New') {
                return $http.put(urlBase + 'users/deactivate?userIp=' + IP + '&userAgent=Browser/Application', deactivateSystemUserData,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else if (status === 'Inactive') {
                return $http.put(urlBase + 'users/activate?userIp=' + IP + '&userAgent=Browser/Application', deactivateSystemUserData,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.saveRole = function (UserRole) {
            if (UserRole.roleId !== undefined) {
                return $http.put(urlBase + 'roles?userIp=' + IP + '&userAgent=Browser/Application', UserRole,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else {
                return $http.post(urlBase + 'roles?userIp=' + IP + '&userAgent=Browser/Application', UserRole,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.approveRoles = function (RoleApprovaldata) {
            return $http.put(urlBase + 'roles/approve-actions?userIp=' + IP + '&userAgent=Browser/Application', RoleApprovaldata,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };
        this.declineRoles = function (RoleApprovaldata) {
            return $http.put(urlBase + 'roles/decline-actions?userIp=' + IP + '&userAgent=Browser/Application', RoleApprovaldata,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };
        this.getRolePermissions = function () {
            return $http.get(urlBase + 'roles/entities?userIp=' + IP + '&userAgent=Browser/Application&size=99999&page=0',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getRoles = function (actionStatus, filter) {
            var roles_filter = filter.keyword ? "needle=" + filter.keyword + "&" : "";
            roles_filter = (filter.approvalStatus && filter.approvalStatus !== 'All') ? roles_filter + "actionStatus=" + filter.approvalStatus + "&" : roles_filter;
            if (actionStatus) {
                return $http.get(urlBase + 'principal-customer?actionStatus=' + actionStatus + '&' + roles_filter + '&userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else {
                return $http.get(urlBase + 'roles?sort=roleId,desc&' + roles_filter + '&userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.deleteUSERROLE = function (deleteUserRoleData) {
            return $http.delete(urlBase + 'roles?userIp=' + IP + '&userAgent=Browser/Application',
                    {
                        headers: {'X-CSRF-TOKEN': hValue, 'Content-Type': 'application/json'},
                        data: deleteUserRoleData
                    });
        };
        /**
         * Fetch role changes
         * @param {type} roleId
         * @returns {unresolved}
         */
        this.getRoleChanges = function (roleId) {
            return $http.get(urlBase + 'roles/' + roleId + '/changes',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        }

        this.getAuditTrails = function (filter, outputFormat, userId, customerId) {
            var audit_filter = filter.dateFrom ? "from=" + $filter('date')(filter.dateFrom, 'yyyy/MM/dd') + "&" : "";
            audit_filter = filter.dateTo ? audit_filter + "to=" + $filter('date')(filter.dateTo, 'yyyy/MM/dd') + "&" : audit_filter;
            audit_filter = filter.keyword ? audit_filter + "needle=" + filter.keyword + "&" : audit_filter;
            audit_filter = (filter.approvalStatus && filter.approvalStatus !== 'All') ? audit_filter + "status=" + filter.approvalStatus + "&" : audit_filter;
            audit_filter = (filter.subscriptionStatus && filter.subscriptionStatus !== 'All') ? audit_filter + "activityType=" + filter.subscriptionStatus + "&" : audit_filter;
            audit_filter = filter.userId ? audit_filter + "userId=" + filter.userId + "&" : audit_filter;

            var export_report = outputFormat ? '/' + outputFormat : '';
            if (userId) {
                return $http.get(urlBase + 'reports/audit-trail?userId=' + userId + '&' + audit_filter + '&userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else if (customerId) {
                return $http.get(urlBase + 'reports/audit-trail?customerId=' + customerId + '&entityName=CmsPrincipalCustomer&' + audit_filter + '&userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else {
                return $http.get(urlBase + 'reports/audit-trail' + export_report + '?sort=logId,desc&' + audit_filter + '&userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.getCustomerAuditTrails = function (filter, customerId) {
            var audit_filter = filter.dateFrom ? "from=" + $filter('date')(filter.dateFrom, 'yyyy/MM/dd') + "&" : "";
            audit_filter = filter.dateTo ? audit_filter + "to=" + $filter('date')(filter.dateTo, 'yyyy/MM/dd') + "&" : audit_filter;
            audit_filter = filter.keyword ? audit_filter + "needle=" + filter.keyword + "&" : audit_filter;
            audit_filter = (filter.approvalStatus && filter.approvalStatus !== 'All') ? audit_filter + "status=" + filter.approvalStatus + "&" : audit_filter;
            audit_filter = (filter.subscriptionStatus && filter.subscriptionStatus !== 'All') ? audit_filter + "activityType=" + filter.subscriptionStatus + "&" : audit_filter;

            return $http.get(urlBase + 'reports/audit-trail?customerId=' + customerId + '&entityName=CmsPrincipalCustomer&' + audit_filter + '&userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.deactivateCUST = function (deactivateCUSTOMERData, status) {
            if (status === 'Active') {
                return $http.put(urlBase + 'principal-customer/deactivate?userIp=' + IP + '&userAgent=Browser/Application', deactivateCUSTOMERData,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else if (status === 'Inactive') {
                return $http.put(urlBase + 'principal-customer/activate?userIp=' + IP + '&userAgent=Browser/Application', deactivateCUSTOMERData,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.deleteCustomers = function (deleteCustomerData) {
            return $http.delete(urlBase + 'principal-customer?userIp=' + IP + '&userAgent=Browser/Application',
                    {
                        headers: {'X-CSRF-TOKEN': hValue, 'Content-Type': 'application/json'},
                        data: deleteCustomerData
                    });
        };

        this.getCustomerCategories = function (fetchAll) {
            var pagenationParams = fetchAll ? '&size=99999&page=0' : '&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber;
            return $http.get(urlBase + 'principal-customer/category?userIp=' + IP + '&userAgent=Browser/Application' + pagenationParams,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.deleteCCategory = function (deleteCategoryData) {
            return $http.delete(urlBase + 'principal-customer/category?userIp=' + IP + '&userAgent=Browser/Application',
                    {
                        headers: {'X-CSRF-TOKEN': hValue, 'Content-Type': 'application/json'},
                        data: deleteCategoryData
                    });
        };

        this.getUnapprovedCustomerCategories = function (fetchAll) {
            var pagenationParams = fetchAll ? '&size=99999&page=0' : '&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber;
            return $http.get(urlBase + 'principal-customer/category?actionStatus=Unapproved&userIp=' + IP + '&userAgent=Browser/Application' + pagenationParams,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };
        this.approveCustomerCategories = function (CustomerCategoryApprovaldata, action) {
            if (action === "approved") {
                return $http.put(urlBase + 'principal-customer/category/approve-actions?userIp=' + IP + '&userAgent=Browser/Application', CustomerCategoryApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else if (action === "rejected") {
                return $http.put(urlBase + 'principal-customer/category/decline-actions?userIp=' + IP + '&userAgent=Browser/Application', CustomerCategoryApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.getCustomerCategoryChanges = function (custCategoryId) {
            return $http.get(urlBase + 'principal-customer/category/' + custCategoryId + '/changes',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        }

        this.saveCustomerCategory = function (CustomerCategory) {
            if (CustomerCategory.custCategoryId !== undefined) {
                return $http.put(urlBase + 'principal-customer/category?userIp=' + IP + '&userAgent=Browser/Application', CustomerCategory,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else {
                return $http.post(urlBase + 'principal-customer/category?userIp=' + IP + '&userAgent=Browser/Application', CustomerCategory,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.getDepartments = function (fetchAll) {
            var pagenationParams = fetchAll ? '&size=99999&page=0' : '&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber;
            return $http.get(urlBase + 'departments?userIp=' + IP + '&userAgent=Browser/Application' + pagenationParams,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.saveDepartment = function (Department) {
            if (Department.departmentId !== undefined) {
                return $http.put(urlBase + 'departments?userIp=' + IP + '&userAgent=Browser/Application', Department,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else {
                return $http.post(urlBase + 'departments?userIp=' + IP + '&userAgent=Browser/Application', Department,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.deleteDepartment = function (deleteDepartmentData) {
            return $http.delete(urlBase + 'departments?userIp=' + IP + '&userAgent=Browser/Application',
                    {
                        headers: {'X-CSRF-TOKEN': hValue, 'Content-Type': 'application/json'},
                        data: deleteDepartmentData
                    });
        };

        this.getUnapprovedDepartments = function (fetchAll) {
            var pagenationParams = fetchAll ? '&size=99999&page=0' : '&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber;
            return $http.get(urlBase + 'departments?actionStatus=Unapproved&userIp=' + IP + '&userAgent=Browser/Application' + pagenationParams,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };
        this.approveDepartments = function (DepartmentApprovaldata, action) {
            if (action === "approved") {
                return $http.put(urlBase + 'departments/approve-actions?userIp=' + IP + '&userAgent=Browser/Application', DepartmentApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else if (action === "rejected") {
                return $http.put(urlBase + 'departments/decline-actions?userIp=' + IP + '&userAgent=Browser/Application', DepartmentApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.getDepartmentChanges = function (departmentId) {
            return $http.get(urlBase + 'departments/' + departmentId + '/changes',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        }

        this.getRegions = function () {
            return $http.get(urlBase + 'regions?sort=regionId,desc&userIp=' + IP + '&userAgent=Browser/Application',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.saveRegion = function (Region) {
            if (Region.regionId !== undefined) {
                return $http.put(urlBase + 'regions?userIp=' + IP + '&userAgent=Browser/Application', Region,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else {
                return $http.post(urlBase + 'regions?userIp=' + IP + '&userAgent=Browser/Application', Region,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.deleteLocation = function (deleteRegionData) {
            return $http.delete(urlBase + 'regions?userIp=' + IP + '&userAgent=Browser/Application',
                    {
                        headers: {'X-CSRF-TOKEN': hValue, 'Content-Type': 'application/json'},
                        data: deleteRegionData
                    });
        };

        this.getCurrency = function (currencyCode) {
            return $http.get(urlBase + 'currency/get_currency/' + currencyCode + '?userIp=' + IP + '&userAgent=Browser/Application',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getCurrencies = function () {
            return $http.get(urlBase + 'currency/all_currencies?userIp=' + IP + '&userAgent=Browser/Application&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.saveCurrency = function (Currency) {

            return $http.post(urlBase + 'currency/add_currency?userIp=' + IP + '&userAgent=Browser/Application', Currency,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });

        };

        this.updateCurrency = function (Currency) {
            return $http.put(urlBase + 'currency/update_currency?userIp=' + IP + '&userAgent=Browser/Application', Currency,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });

        };


        this.deleteCurrencyRecord = function (deleteCurrenciesData) {
            return $http.delete(urlBase + 'currency?userIp=' + IP + '&userAgent=Browser/Application',
                    {
                        headers: {'X-CSRF-TOKEN': hValue, 'Content-Type': 'application/json'},
                        data: deleteCurrenciesData
                    });
        };

        this.getUnapprovedCurrency = function (fetchAll) {
            var pagenationParams = fetchAll ? '&size=99999&page=0' : '&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber;
            return $http.get(urlBase + 'currency/all_currencies?actionStatus=Unapproved&userIp=' + IP + '&userAgent=Browser/Application' + pagenationParams,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };
        this.approveCurrency = function (CurrencyApprovaldata, action) {
            if (action === "approved") {
                return $http.put(urlBase + 'currency/approve-actions?userIp=' + IP + '&userAgent=Browser/Application', CurrencyApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else if (action === "rejected") {
                return $http.put(urlBase + 'currency/decline-actions?userIp=' + IP + '&userAgent=Browser/Application', CurrencyApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.getCurrencyChanges = function (currencyCode) {
            return $http.get(urlBase + 'currency/' + currencyCode + '/changes',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        }

        this.changePassword = function (PasswordChange) {
            return $http.post(urlBase + 'users/password?username=' + PasswordChange.username + '&currentPassword=' + PasswordChange.currentPassword + '&newPassword=' + PasswordChange.newPassword + '&userIp=' + IP + '&userAgent=Browser/Application', PasswordChange,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getPasswordPolicy = function () {
            return $http.get(urlBase + 'sys-config/password?userIp=' + IP + '&userAgent=Browser/Application',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.savePasswordPolicy = function (PasswordPolicy) {
            return $http.put(urlBase + 'sys-config/password?userIp=' + IP + '&userAgent=Browser/Application', PasswordPolicy,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getGlobalParams = function (entity) {
            return $http.get(urlBase + 'sys-config/entity/' + entity + '?userIp=' + IP + '&userAgent=Browser/Application',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.saveGlobalParam = function (GlobalParam) {
            return $http.put(urlBase + 'sys-config/' + GlobalParam.id + '?value=' + GlobalParam.value + '&userIp=' + IP + '&userAgent=Browser/Application', {},
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.getUnapprovedConfig = function (fetchAll) {
            var pagenationParams = fetchAll ? '&size=99999&page=0' : '&size=' + $localStorage.pageSize + '&page=' + $localStorage.pageNumber;
            return $http.get(urlBase + 'sys-config?actionStatus=Unapproved&userIp=' + IP + '&userAgent=Browser/Application' + pagenationParams,
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };
        this.approveSysConfig = function (SysConfigApprovaldata, action) {
            if (action === "approved") {
                return $http.put(urlBase + 'sys-config/approve-actions?userIp=' + IP + '&userAgent=Browser/Application', SysConfigApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            } else if (action === "rejected") {
                return $http.put(urlBase + 'sys-config/decline-actions?userIp=' + IP + '&userAgent=Browser/Application', SysConfigApprovaldata,
                        {
                            headers: {'X-CSRF-TOKEN': hValue}
                        });
            }
        };

        this.getConfigChanges = function (id) {
            return $http.get(urlBase + 'sys-config/' + id + '/changes',
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        }


    }]);
