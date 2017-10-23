'use strict';
angular.module('app', ['ngRoute', 'ngMaterial', 'restangular'])
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('');
    }])
    // .config(function($mdIconProvider) {
    //     $mdIconProvider
    //         .iconSet('communication', 'img/icons/sets/communication-icons.svg', 24);
    // })
    .config(function ($routeProvider) { //Створюєм адреси
        $routeProvider
            .when('/', {
                templateUrl: './template/homePageDirective.tpl.html',
                controller: HomePageController,
                controllerAs: 'homePageCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .service('MessageDataService', function (Restangular) {
        return {
            getMessages: getMessages,
            addMessage: addMessage,
        };

        function getMessages() {
            return Restangular.all('api/messages').getList()
        }

        function addMessage(text_message) {
            return Restangular.all('api/message').post({'text_message': text_message})
        }
    })
    .service('UserDataService', function (Restangular) {
        return {
            getUsers: getUsers,
            addUser: addUser,
        };

        function getUsers() {
            return Restangular.all('api/users').getList()
        }

        function addUser(login, password, image) {
            return Restangular.all('api/user').post({'login': login, 'password': password, 'image': image})
        }
    })
    .controller('MainCtrl', function ($scope, $http) {

    })
    .directive('homePage', function () {
        return {
            restrict: 'E',
            templateUrl: './template/homePageDirective.tpl.html',
            replace: true,
            controller: HomePageController,
            controllerAs: 'homePageCtrl',
            bindToController: true,
            scope: {}
        }
    })
    .directive('messages', function () {
        return {
            replace: true,
            templateUrl: 'template/messages.tpl.html',
            controllerAs: 'messagesCtrl',
            controller: function ($scope, $interval, UserDataService, MessageDataService) {
                const self = this;
                self.messages = [];
                self.users = [];
                self.newMessage = '';

                self.getUserById = getUserById;
                self.sendMessage = sendMessage;

                function getUserById(user_id) {
                    for (let i = 0; i < self.users.length; i++) {
                        if (self.users[i].id === user_id) {
                            return self.users[i]
                        }
                    }
                }

                function sendMessage() {
                    MessageDataService.addMessage(self.newMessage).then(
                        function () {
                            self.newMessage = '';
                        }
                    )
                }

                function init() {
                    UserDataService.getUsers().then(function (users) {
                        self.users = users;
                    });
                    MessageDataService.getMessages().then(function (messages) {
                        self.messages = messages;
                    });
                }

                init();

                $interval(function () {
                    // UserDataService.getUsers().then(function (users) {
                    //     self.users = users;
                    // });
                    MessageDataService.getMessages().then(function (messages) {
                        self.messages = messages;
                    });
                }, 2000)
            }

        }
    })
    .directive('registration', function () {
        return {
            replace: true,
            templateUrl: 'template/registration.tpl.html',
            controllerAs: 'registrationCtrl',
            controller: function (UserDataService) {
                const self = this;
                self.login = '';
                self.password = '';
                self.register = register;

                function register() {
                    UserDataService.addUser(self.login, self.password, '')
                }

            }
        }
    });


function HomePageController($scope) {
}
