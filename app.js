$(document).ready(function(){

    var request = "https://api.themoviedb.org/3/movie/now_playing?api_key=2adc1efea60bd3eefc285c12532c4ce8&language=en-US&page=1"
    var movies = $.get(request, function(response) {
        app._data.currentMovies = response.results.slice(0,3);
    });

    const app = new Vue({
            el: "#app",
            data: {
                totalCost: 0,
                totalCostOfAdultTickets: 0,
                totalCostOfChildrenTickets: 0,
                currentMovies: [],
                currentMoviesOffset: 0,
                childrensTicketPrice: 5.99,
                adultsTicketPrice: 8.99,
                ticketObject: {},
                checkoutTableVisible: false,
            },
            methods: {
                removeMoviesTickets(movieTitle) {
                    this.totalCost -= this.childrensTicketPrice * this.ticketObject[movieTitle]['childrens_tickets'];
                    this.totalCostOfChildrenTickets -= this.childrensTicketPrice * this.ticketObject[movieTitle]['childrens_tickets'];
                    this.totalCost -= this.adultsTicketPrice * this.ticketObject[movieTitle]['adults_tickets'];
                    this.totalCostOfAdultTickets -= this.adultsTicketPrice * this.ticketObject[movieTitle]['adults_tickets'];
                    this.$delete(this.ticketObject, movieTitle);
                },
                removeTicket(movieTitle, ticketCategory) {
                    if (ticketCategory === "childrens_tickets") {
                        this.totalCost -= this.childrensTicketPrice;
                        this.totalCostOfChildrenTickets -= this.childrensTicketPrice;
                    } else {
                        this.totalCost -= this.adultsTicketPrice;
                        this.totalCostOfAdultTickets -= this.adultsTicketPrice;
                    }

                    this.ticketObject[movieTitle][ticketCategory] -= 1
                    if (this.ticketObject[movieTitle]['childrens_tickets'] < 1 && this.ticketObject[movieTitle]['adults_tickets'] < 1) {
                        this.$delete(this.ticketObject, movieTitle);
                    }
                },
                toggleCheckoutTable() {
                    if (this.checkoutTableVisible) {
                        this.checkoutTableVisible = false
                    } else {
                        this.checkoutTableVisible = true
                    }
                },
                hoverCheckoutTab(hoverColor) {
                    $(`#checkout_tab_arrow`).css("border-top-color",hoverColor);
                    $(`#checkout_tab`).css("background",hoverColor);
                },
                mouseoverMovieCard(movieIndex) {
                    $(`#image_${movieIndex}`).css("opacity",0.25);
                    $(`#text_${movieIndex}`).css("opacity",1);
                    $(`#text_header_${movieIndex}`).css("opacity",1);
                    $(`#buttons_${movieIndex}`).css("opacity",1);
                },
                mouseleaveMovieCard(movieIndex) {
                    $(`#image_${movieIndex}`).css("opacity",1);
                    $(`#text_${movieIndex}`).css("opacity",0);
                    $(`#text_header_${movieIndex}`).css("opacity",0);
                    $(`#buttons_${movieIndex}`).css("opacity",0);
                },
                previousSetOfMovies() {
                    if (this.currentMoviesOffset > 0) {
                        this.currentMoviesOffset -= 3
                        this.currentMovies = movies.responseJSON.results.slice(this.currentMoviesOffset, this.currentMoviesOffset+3);
                    }
                },
                nextSetOfMovies() {
                    if (this.currentMoviesOffset + 3 < movies.responseJSON.results.length) {
                        this.currentMoviesOffset += 3
                        this.currentMovies = movies.responseJSON.results.slice(this.currentMoviesOffset, this.currentMoviesOffset+3);
                    }
                },
                orderTicket(movieTitle, additionalChildrensTickets, additionalAdultsTickets) {
                    this.totalCostOfAdultTickets += additionalAdultsTickets * this.adultsTicketPrice;
                    this.totalCostOfChildrenTickets += additionalChildrensTickets * this.childrensTicketPrice;
                    this.totalCost += additionalAdultsTickets * this.adultsTicketPrice + additionalChildrensTickets * this.childrensTicketPrice;
                    if (this.ticketObject[movieTitle]) {
                        this.$set(this.ticketObject, movieTitle, {
                            'childrens_tickets': this.ticketObject[movieTitle]['childrens_tickets'] + additionalChildrensTickets,
                            'adults_tickets': this.ticketObject[movieTitle]['adults_tickets'] + additionalAdultsTickets
                        })
                    } else {
                        this.$set(this.ticketObject, movieTitle, {
                            'childrens_tickets': additionalChildrensTickets,
                            'adults_tickets': additionalAdultsTickets
                        })
                    }
                }
            }
    });
});