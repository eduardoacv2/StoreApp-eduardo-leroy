$(document).on('pagebeforeshow', "#product", function( event, ui ) {
	console.log("John");
	$.ajax({
		url : "http://localhost:3412/StoreApp/product",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var productList = data.product;
			var len = productList.length;
			var list = $("#product-list");
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				list.append("<li><a onclick=GetProduct(" + product.pName+ ")>" + 
					"<h2>" + product.pType1 + " " + product.pType2 +  "</h2>" + 
					"<p><strong> Seller: " + product.pSeller + "</strong></p>" + 
					"<p>" + product.pCondition + "</p>" +
					"<p class=\"ui-li-aside\">" + accounting.formatMoney(product.pBidPrice) + "</p>" +
					"</a></li>");
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#product-view", function( event, ui ) {
	
	$("#upd-type").val(currentProduct.pType1);
	$("#upd-typeOfType").val(currentProduct.pType2);
	$("#upd-name").val(currentProduct.pName);
	$("#upd-price").val(currentProduct.pPrice);
	$("#upd-condition").val(currentProduct.pCondition);
	$("#upd-startingBid").val(currentProduct.pStartingBid);
	$("#upd-bidPrice").val(currentProduct.pBidPrice);
	$("#upd-seller").val(currentProduct.pSeller);
	$("#upd-buyer").val(currentProduct.pBuyer);
	$("#upd-image").val(currentProduct.pImage);


});

////////////////////////////////////////////////////////////////////////////////////////////////
/// Functions Called Directly from Buttons ///////////////////////

function ConverToJSON(formData){
	var result = {};
	$.each(formData, 
		function(i, o){
			result[o.name] = o.value;
	});
	return result;
}

function SaveProduct(){
	$.mobile.loading("show");
	var form = $("#product-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newProduct = ConverToJSON(formData);
	console.log("New Car: " + JSON.stringify(newProduct));
	var newProductJSON = JSON.stringify(newProduct);
	$.ajax({
		url : "http://localhost:3412/StoreApp/product",
		method: 'post',
		data : newProductJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#product");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data could not be added!");
		}
	});


}

var currentPro = {};

function GetProduct(id){
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/StoreApp/product/" + id,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			currentPro = data.product;
			$.mobile.loading("hide");
			$.mobile.navigate("#product-view");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Product not found.");
			}
			else {
				alter("Internal Server Error.");
			}
		}
	});
}

function UpdateProduct(){
	$.mobile.loading("show");
	var form = $("#product-view-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var updPro = ConverToJSON(formData);
	updPro.id = currentPro.id;
	console.log("Updated Product: " + JSON.stringify(updPro));
	var updProJSON = JSON.stringify(updPro);
	$.ajax({
		url : "http://localhost:3412/StoreApp/product/" + updPro.id,
		method: 'put',
		data : updProJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#product");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Data could not be updated!");
			}
			else {
				alert("Internal Error.");		
			}
		}
	});
}

function DeleteProduct(){
	$.mobile.loading("show");
	var id = currentPro.id;
	$.ajax({
		url : "http://localhost:3412/StoreApp/product/" + id,
		method: 'delete',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#product");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Product not found.");
			}
			else {
				alter("Internal Server Error.");
			}
		}
	});
}