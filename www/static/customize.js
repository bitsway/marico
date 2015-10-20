
//online
//var apipath_base_photo_dm='eapps001.cloudapp.net/marico/syncmobile_prescription/dm_prescription_path?HTTPPASS=e99business321cba'

//local
var apipath_base_photo_dm='http://127.0.0.1:8000/marico/syncmobile/dm_path?cid=MARICO&HTTPPASS=e99business321cba'


var apipath="";

var url =''
var latitude="";
var longitude="";

function getLocation() {
	$("#msg_auction_details").html("Confirming location. Please wait.");	
	/*var options = { enableHighAccuracy: false};
	navigator.geolocation.getCurrentPosition(onSuccess, onError , options);*/	
}

// onSuccess Geolocation
function onSuccess(position) {
	$("#lat").val(position.coords.latitude);
	$("#long").val(position.coords.longitude);
	$("#msg_auction_details").html("Location Confirmed");
}

// onError Callback receives a PositionError object
function onError(error) {
   $("#lat").val(0);
   $("#long").val(0);
   $("#msg_auction_details").html("Failed to Confirmed Location.");
}

function replace_special_char(string_value){
	var real_value=string_value.replace(/\)/g,'').replace(/\(/g,'').replace(/\$/g,'').replace(/\{/g,'').replace(/\}/g,'').replace(/\[/g,'').replace(/\]/g,'').replace(/\"/g,'').replace(/\'/g,"").replace(/\>/g,'').replace(/\</g,'').replace(/\%/g,'').replace(/\&/g,'').replace(/\#/g,'').replace(/\@/g,'').replace(/\|/g,'').replace(/\//g,"").replace(/\\/g,'').replace(/\~/g,'').replace(/\!/g,'').replace(/\;/g,'');
	return real_value;
}

// -------------
$(document).ready(function(){
		$("#wait_image_login").hide();
		$("#loginButton").show();	
		
		$("#wait_image_home").hide();
		$(".btn_auction").show();
		$(".btn_auction").show();
		
		$("#q_lat").val("");
		$("#q_long").val("");
		
		$("#wait_image_auction").hide();	
		$("#btn_auction_submit").show();
		$("#confirmSubmit").show();
		
		$("#wait_image_auction_details").hide();
		
		//alert(localStorage.synced)
		// -------------- If Not synced, Show login
		if ((localStorage.synced!='YES')){	
			$("#c_id").val("")
			$("#user_id").val("")
			$("#user_pass").val("")
			
			url = "#login";		
		}else{
			$("#c_id").val(localStorage.c_id)
			$("#user_id").val(localStorage.user_id)
			$("#user_pass").val(localStorage.user_pass)
			
			url = "#pageHome";
		}
		
		$.mobile.navigate(url);
	});

function get_login() {
	url = "#login";
	$.mobile.navigate(url);
	}

//================= Clear authorization
function clear_autho(){
	var check_clear=$("input[name='clear_auth_check']:checked").val();
	
	if(check_clear!='Yes'){
		$("#error_login").html("Required Confirm Clear");			
	}else{
		localStorage.base_url='';
		localStorage.photo_url='';
		localStorage.photo_submit_url='';
		
		localStorage.synced='';
		localStorage.c_id='';
		localStorage.user_id='';
		localStorage.user_pass='';		
		localStorage.sync_code='';
		
		url = "#login";
		$.mobile.navigate(url);	
		location.reload();
	};
}

//========================= Longin: Check user
function check_user() {
	
	var c_id='MARICO'//$("#c_id").val().toUpperCase();
	var user_id=$("#user_id").val().toUpperCase();
	var user_pass=$("#user_pass").val();
	
	var base_url='';
	var photo_url='';
	var photo_submit_url=''
	//-----
	if (user_id=="" || user_id==undefined || user_pass=="" || user_pass==undefined){
		$("#error_login").html("Required User ID and Password");	
	}else{
			
			$("#wait_image_login").show();
			$("#loginButton").hide();
			$("#error_login").html("")
			$("#error_home_page").html("")
			
			localStorage.base_url='';
			localStorage.photo_url='';
			localStorage.photo_submit_url='';
			
			//----
			$.ajax({
				 type: 'POST',
				 url: apipath_base_photo_dm,
				 success: function(result) {					
					if (result==''){
						$("#wait_image_login").hide();
						$("#loginButton").show();
						$("#error_login").html('Base URL not available');
					}else{
						var startIndex=result.indexOf('<start>');
						var endIndex=result.indexOf('<end>');
						
						var urlResult=result.substring(startIndex+7,endIndex);
						
						var resultArray = urlResult.split('<fd>');		
						if(resultArray.length==3){
							base_url=resultArray[0]
							photo_url=resultArray[1]
							photo_submit_url=resultArray[2]
							
							//-------------
							if(base_url=='' || photo_url==''){	
								$("#wait_image_login").hide();
								$("#loginButton").show();
								$("#error_login").html('Base URL not available');	
							}else{
								//--------------------------
								$("#error_login").html("");		
								$("#loginButton").hide();
								$("#wait_image_login").show();
								
								localStorage.base_url=base_url;
								localStorage.photo_url=photo_url;
								localStorage.photo_submit_url=photo_submit_url;
								
								localStorage.synced='NO'
								
								//-----------------
								//alert(localStorage.base_url+'check_user?cid='+c_id+'&rep_id='+encodeURIComponent(user_id)+'&rep_pass='+encodeURIComponent(user_pass)+'&synccode='+localStorage.sync_code);
								
								$.ajax({
										 type: 'POST',
										 url: localStorage.base_url+'check_user?cid='+c_id+'&rep_id='+encodeURIComponent(user_id)+'&rep_pass='+encodeURIComponent(user_pass)+'&synccode='+localStorage.sync_code,
										 success: function(result) {											
												if (result==''){
													$("#wait_image_login").hide();
													$("#loginButton").show();
													$("#error_login").html('Network timeout. Please ensure you have active internet connection.');
													
												}else{
													syncResult=result
																					
													var syncResultArray = syncResult.split('<SYNCDATA>');
													
													if (syncResultArray[0]=='FAILED'){						
														$("#error_login").html(syncResultArray[1]);
														$("#wait_image_login").hide();
														$("#loginButton").show();
													}else if (syncResultArray[0]=='SUCCESS'){
														
														localStorage.synced='YES';	
														localStorage.c_id=c_id;	
														localStorage.user_id=user_id;
														localStorage.user_pass=user_pass
														
														localStorage.sync_code=syncResultArray[1];
																	
														$("#wait_image_login").hide();
														$("#loginButton").show();
														
														//----------------									
														url = "#pageHome";
														$.mobile.navigate(url);								
														
													}else {									
														$("#wait_image_login").hide();
														$("#loginButton").show();									
														$("#error_login").html("Sync Failed. Authorization or Network Error.");									
													}								
												}
											  },
										  error: function(result) {					 
											  $("#wait_image_login").hide();
											  $("#loginButton").show();
											  $("#error_login").html("Sync Failed. Network Error.");		
											
										  }
									  });//end ajax
									  
									}//base url check
									
						}
					}
				 }
			
			});//end ajax
	   }
	}//function


function getAuction(){	
	$("#error_home_page").html("")
	
	$("#wait_image_home").hide();
	$(".btn_auction").show();
	
	var rep_id=localStorage.user_id
	if (rep_id==''||rep_id==undefined){
		$("#error_home_page").html("Required Sync")
	}else{
		
		$("#wait_image_home").show();
		$(".btn_auction").hide();
		
		//alert(localStorage.base_url+'get_auction?cid='+localStorage.c_id+'&rep_id='+localStorage.user_id+'&password='+encodeURIComponent(localStorage.user_pass)+'&synccode='+localStorage.sync_code)							
		
		$.ajax({
			 type: 'POST',
			 url: localStorage.base_url+'get_auction?cid='+localStorage.c_id+'&rep_id='+localStorage.user_id+'&rep_pass='+encodeURIComponent(localStorage.user_pass)+'&synccode='+localStorage.sync_code,
			 success: function(result) {						
					if (result==''){
						$("#error_home_page").html('Network timeout. Please ensure you have active internet connection.');
						$("#wait_image_home").hide();
						$(".btn_auction").show();
					}else{
						var resultArray = result.split('<SYNCDATA>');			
						if (resultArray[0]=='FAILED'){						
							$("#error_home_page").html(resultArray[1]);
							$("#wait_image_home").hide();
							$(".btn_auction").show();
						}else if (resultArray[0]=='SUCCESS'){
							
							var result_string=resultArray[1];
							
							var dataList=result_string.split('<rd>');
							var dataListLength=dataList.length;
							
							//------------------------
							var auctionStrData='<tr style="font-weight:bold; text-shadow:none; color:#408080;" ><td >Auction Date</td><td >Vehicle</td><td >Shipping</td><td >Details</td></tr>'
													
							for (i=0; i < dataListLength; i++){
								var auctionDataList=dataList[i].split('<fd>');
								
								auctionStrData+='<tr style="font-size:11px;border-color:#4E9A9A;"><td style="border-color:#4E9A9A;"><b>'+auctionDataList[1]+'</b><br>'+auctionDataList[10]+'<br>'+auctionDataList[11]+'</td><td style="border-color:#4E9A9A;">'+auctionDataList[7]+', '+auctionDataList[8]+',<br>Qty: '+auctionDataList[9]+',<br>Del:'+auctionDataList[4]+'</td><td style="border-color:#4E9A9A;"><b>'+auctionDataList[5]+'</b><br>To<br><b>'+auctionDataList[6]+'</b></td><td style="border-color:#4E9A9A;"><input type="hidden" id="aId_'+auctionDataList[0]+'" value="'+dataList[i]+'"/><a data-role="button" onClick="auction_details(\''+auctionDataList[0]+'\');" style="background-color:inherit"> >> </a></td></tr>'
								
								}
							
							$("#tbl_auction").empty()
							$("#tbl_auction").append(auctionStrData).trigger('create');
							
									
							$("#msg_auction").html("");
							$("#wait_image_home").hide();
							$(".btn_auction").show();
							
							//--------------------------
							url = "#page_auction";
							$.mobile.navigate(url);	
							
						}else{						
							$("#error_home_page").html('Authentication error. Please register and sync to retry.');
							$("#wait_image_home").hide();
							$(".btn_auction").show();
							}
					}
				  },
			  error: function(result) {			  
				  $("#error_home_page").html('Invalid Request'); 
				  $("#wait_image_home").hide();
				  $(".btn_auction").show();
			  }
			  });//end ajax
		
	}
}


function auction_details(actionId){		
		$("#wait_image_auction_details").hide();
		$("#msg_auction_details").html("")
		$("#btn_auction_submit").show();
		$("#confirmSubmit").show();
		
		$("#auction_id").val("");
		$("#vehicle_rate").val("");
		$("#total_value").val("");
		
		$("input[name='confirmSubmit']:checked").attr('checked',false);
		
		
		var acutionData=$("#aId_"+actionId).val();
		var auctionDataList=acutionData.split('<fd>');
		<!--0 auctionID+'<fd>1'+auctionInitiatedDate+'<fd>2'+auctionCategory+'<fd>3'+shortNote+'<fd>4'+dateOfDelivery+'<fd>5'+shippingFrom+'<fd>6'+shippingTo+'<fd>7'+vehicleType+'<fd>8'+vehicleCapacity+'<fd>9'+vehicleQty+'<fd>10'+auctionStart+'<fd>11'+auctionEnd+'<fd>12'+typeofGoods+'<fd>13'+grossWeight+'<fd>14'+vendorCategory+'<fd>15'+pONo+'<fd>16'+minimumBidInterval-->
		if(auctionDataList.length!=18){
			$("#msg_auction").html("Error in detail show")			
		}else{
		
			$("#auction_id").val(auctionDataList[0]);
			$("#vehicle_no").val(auctionDataList[9]);
			
			$("#auction_initiated").html(auctionDataList[1]+' <br>'+ auctionDataList[10] +' - '+ auctionDataList[11]);
			$("#vehicle_type").html(auctionDataList[7]+', '+auctionDataList[8]);			
			$("#delivery_date").html(auctionDataList[4]);
			$("#shipping_from").html(auctionDataList[5]+' (To)<br> '+auctionDataList[6]);			
			$("#type_of_goods").html(auctionDataList[12]);
			
			
			$("#vehicle_rate").val("");		
			$("#total_value").val("");
			
			var minimumTotal=0
			try{
				minimumTotal=eval(auctionDataList[9])*eval(auctionDataList[17])
			}catch(e){
				minimumTotal=0
				}
			
			$("#minimum_bit_rate").val(auctionDataList[17]);
			$("#minimum_total").val(minimumTotal);
			
			//--------------------------	
			url = "#page_auction_details";
			$.mobile.navigate(url);
		}
}


function auction_submit(){
	$("#wait_image_auction_details").hide();
	$("#msg_auction_details").html("")
	$("#btn_auction_submit").show();	
	$("#confirmSubmit").show();
	
	var auction_id=$("#auction_id").val();
	var vehicle_rate=$("#vehicle_rate").val();
	var minimum_bit_rate=$("#minimum_bit_rate").val();
	
	var confirmStatus=$("input[name='confirmSubmit']:checked").val();
		
	if (auction_id==''){		
		$("#msg_auction_details").text("Required Auction");
	}else{
		
		if (vehicle_rate=='' || vehicle_rate<=0){
			$("#msg_auction_details").html('Required valid rate');
		
		}else{			
			if (minimum_bit_rate > 0 && (minimum_bit_rate<=vehicle_rate)){
				$("#msg_auction_details").html('Rate should be less than Minimum Rate');
			
			}else{
				if (confirmStatus!='YES'){
					$("#msg_auction_details").text("Required Checked Confirmation");
				}else{
					$("#wait_image_auction_details").show();
					$("#btn_auction_submit").hide();
					$("#confirmSubmit").hide();
					
					//alert(localStorage.base_url+'auction_submit?cid='+localStorage.c_id+'&rep_id='+localStorage.user_id+'&rep_pass='+encodeURIComponent(localStorage.user_pass)+'&synccode='+localStorage.sync_code+'&auction_id='+encodeURIComponent(auction_id)+'&vehicle_rate='+vehicle_rate)							
					
					$.ajax({
						 type: 'POST',
						 url: localStorage.base_url+'auction_submit?cid='+localStorage.c_id+'&rep_id='+localStorage.user_id+'&rep_pass='+encodeURIComponent(localStorage.user_pass)+'&synccode='+localStorage.sync_code+'&auction_id='+encodeURIComponent(auction_id)+'&vehicle_rate='+vehicle_rate,
						 success: function(result) {						
								if (result==''){
									$("#msg_auction_details").html('Network timeout. Please ensure you have active internet connection.');
									$("#wait_image_auction_details").hide();
									$("#btn_auction_submit").show();
									$("#confirmSubmit").show();
								}else{
									var resultArray = result.split('<SYNCDATA>');			
									if (resultArray[0]=='FAILED'){						
										$("#msg_auction_details").html(resultArray[1]);
										$("#wait_image_auction_details").hide();
										$("#btn_auction_submit").show();
										$("#confirmSubmit").show();
									}else if (resultArray[0]=='SUCCESS'){									
										var result_string=resultArray[1];
										
										$("#msg_auction_details").html(result_string);
										
										$("#wait_image_auction_details").hide();
										$("#btn_auction_submit").hide();
										$("#confirmSubmit").hide();
										
										//--------------------------
										
									}else{						
										$("#msg_auction_details").html('Authentication error. Please register and sync to retry.');
										$("#wait_image_auction_details").hide();
										$("#btn_auction_submit").show();
										$("#confirmSubmit").show();
										}
								}
							  },
						  error: function(result) {			  
							  $("#msg_auction_details").html('Invalid Request'); 
							  $("#wait_image_auction_details").hide();
							  $("#btn_auction_submit").show();
							  $("#confirmSubmit").show();
						  }
						  });//end ajax
				   }
				}
			}
		}
	//}
}



function refreshAuction(){	
	$("#msg_auction_details").html("")	
	$("#wait_image_auction_details").hide();	
	$("#btn_auction_submit").show();
	$("#confirmSubmit").show();
							
	var auction_id=$("#auction_id").val();
	
	
	var rep_id=localStorage.user_id
	if (rep_id==''||rep_id==undefined){
		$("#msg_auction_details").html("Required Sync")
	}else{
		
		$("#wait_image_auction_details").show();
		$("#btn_auction_submit").hide();
		$("#confirmSubmit").hide();
							  
		//alert(localStorage.base_url+'get_auction?cid='+localStorage.c_id+'&rep_id='+localStorage.user_id+'&password='+encodeURIComponent(localStorage.user_pass)+'&synccode='+localStorage.sync_code)							
		
		$.ajax({
			 type: 'POST',
			 url: localStorage.base_url+'get_auction?cid='+localStorage.c_id+'&rep_id='+localStorage.user_id+'&rep_pass='+encodeURIComponent(localStorage.user_pass)+'&synccode='+localStorage.sync_code,
			 success: function(result) {						
					if (result==''){
						$("#msg_auction_details").html('Network timeout. Please ensure you have active internet connection.');
						$("#wait_image_auction_details").hide();
						$("#btn_auction_submit").show();
						$("#confirmSubmit").show();
					}else{
						var resultArray = result.split('<SYNCDATA>');			
						if (resultArray[0]=='FAILED'){						
							$("#msg_auction_details").html(resultArray[1]);
							$("#wait_image_auction_details").hide();
							$("#btn_auction_submit").show();
							$("#confirmSubmit").show();
						}else if (resultArray[0]=='SUCCESS'){
							
							var result_string=resultArray[1];
							
							var dataList=result_string.split('<rd>');
							var dataListLength=dataList.length;
							
							//------------------------
							var auctionStrData='<tr style="font-weight:bold; text-shadow:none; color:#408080;" ><td >Auction Date</td><td >Vehicle</td><td >Shipping</td><td >Details</td></tr>'
													
							for (i=0; i < dataListLength; i++){
								var auctionDataList=dataList[i].split('<fd>');
								
								auctionStrData+='<tr style="font-size:11px;border-color:#4E9A9A;"><td style="border-color:#4E9A9A;"><b>'+auctionDataList[1]+'</b><br>'+auctionDataList[10]+'<br>'+auctionDataList[11]+'</td><td style="border-color:#4E9A9A;">'+auctionDataList[7]+', '+auctionDataList[8]+',<br>Qty: '+auctionDataList[9]+',<br>Del:'+auctionDataList[4]+'</td><td style="border-color:#4E9A9A;"><b>'+auctionDataList[5]+'</b><br>To<br><b>'+auctionDataList[6]+'</b></td><td style="border-color:#4E9A9A;"><input type="hidden" id="aId_'+auctionDataList[0]+'" value="'+dataList[i]+'"/><a data-role="button" onClick="auction_details(\''+auctionDataList[0]+'\');" style="background-color:inherit"> >> </a></td></tr>'
								
								}
							
							$("#tbl_auction").empty()
							$("#tbl_auction").append(auctionStrData).trigger('create');
							
							
							$("#msg_auction_details").html("");
							$("#wait_image_auction_details").hide();
							$("#btn_auction_submit").show();
							$("#confirmSubmit").show();
							
							
							//alert(auction_id);
							
							auction_details(auction_id)
							
							
							//--------------------------
							url = "#page_auction";
							//$.mobile.navigate(url);	
							
						}else{						
							$("#msg_auction_details").html('Authentication error. Please register and sync to retry.');
							$("#wait_image_auction_details").hide();
							$("#btn_auction_submit").show();
							$("#confirmSubmit").show();
							}
					}
				  },
			  error: function(result) {			  
					$("#msg_auction_details").html('Invalid Request'); 
					$("#wait_image_auction_details").hide();
					$("#btn_auction_submit").show();
					$("#confirmSubmit").show();
			  }
			  });//end ajax
		
	}
}





function getAuctionHistory(){	
	$("#error_home_page").html("")
		
	
	$("#wait_image_home").hide();
	$(".btn_auction").show();
	
	var rep_id=localStorage.user_id
	if (rep_id==''||rep_id==undefined){
		$("#error_home_page").html("Required Sync")
	}else{
		
		$("#wait_image_home").show();
		$(".btn_auction").hide();
		
		//alert(localStorage.base_url+'get_auction_history?cid='+localStorage.c_id+'&rep_id='+localStorage.user_id+'&rep_pass='+encodeURIComponent(localStorage.user_pass)+'&synccode='+localStorage.sync_code)							
		
		$.ajax({
			 type: 'POST',
			 url: localStorage.base_url+'get_auction_history?cid='+localStorage.c_id+'&rep_id='+localStorage.user_id+'&rep_pass='+encodeURIComponent(localStorage.user_pass)+'&synccode='+localStorage.sync_code,
			 success: function(result) {						
					if (result==''){
						$("#error_home_page").html('Network timeout. Please ensure you have active internet connection.');
						$("#wait_image_home").hide();
						$(".btn_auction").show();
					}else{
						var resultArray = result.split('<SYNCDATA>');			
						if (resultArray[0]=='FAILED'){						
							$("#error_home_page").html(resultArray[1]);
							$("#wait_image_home").hide();
							$(".btn_auction").show();
						}else if (resultArray[0]=='SUCCESS'){
							
							var result_string=resultArray[1];
							
							var dataList=result_string.split('<rd>');
							var dataListLength=dataList.length;
							
							//------------------------
							var auctionStrData='<tr style="font-weight:bold; text-shadow:none; color:#408080;" ><td >Auction Date</td><td >Vehicle</td><td >Shipping</td><td >Details</td></tr>'
													
							for (i=0; i < dataListLength; i++){
								var auctionDataList=dataList[i].split('<fd>');
								
								auctionStrData+='<tr style="font-size:11px;border-color:#4E9A9A;"><td style="border-color:#4E9A9A;"><b>'+auctionDataList[1]+'</b><br>'+auctionDataList[10]+'<br>'+auctionDataList[11]+'</td><td style="border-color:#4E9A9A;">'+auctionDataList[7]+', '+auctionDataList[8]+',<br>Qty: '+auctionDataList[9]+',<br>Del:'+auctionDataList[4]+'</td><td style="border-color:#4E9A9A;"><b>'+auctionDataList[5]+'</b><br>To<br><b>'+auctionDataList[6]+'</b></td><td style="border-color:#4E9A9A;"><input type="hidden" id="aHisId_'+auctionDataList[0]+'" value="'+dataList[i]+'"/><a data-role="button" onClick="auction_history_details(\''+auctionDataList[0]+'\');" style="background-color:inherit"> >> </a></td></tr>'
								
								}
							
							$("#tbl_auction_history").empty()
							$("#tbl_auction_history").append(auctionStrData).trigger('create');
							
							$("#wait_image_home").hide();
							$(".btn_auction").show();
							
							$("#msg_auction_history").html("")
							
							//--------------------------
							url = "#page_auction_history";
							$.mobile.navigate(url);	
							
						}else{						
							$("#error_home_page").html('Authentication error. Please register and sync to retry.');
							$("#wait_image_home").hide();
							$(".btn_auction").show();
							}
					}
				  },
			  error: function(result) {			  
				  $("#error_home_page").html('Invalid Request'); 
				  $("#wait_image_home").hide();
				  $(".btn_auction").show();
			  }
			  });//end ajax
		
	}
}


function auction_history_details(actionId){		
				
		var acutionData=$("#aHisId_"+actionId).val();
		var auctionDataList=acutionData.split('<fd>');
		<!--0 auctionID+'<fd>1'+auctionInitiatedDate+'<fd>2'+auctionCategory+'<fd>3'+shortNote+'<fd>4'+dateOfDelivery+'<fd>5'+shippingFrom+'<fd>6'+shippingTo+'<fd>7'+vehicleType+'<fd>8'+vehicleCapacity+'<fd>9'+vehicleQty+'<fd>10'+auctionStart+'<fd>11'+auctionEnd+'<fd>12'+typeofGoods+'<fd>13'+grossWeight+'<fd>14'+vendorCategory+'<fd>15'+pONo+'<fd>16'+minimumBidInterval+'<fd>17'+str(bidDateTime)+'<fd>18'+str(bidRate)-->
		if(auctionDataList.length!=19){
			$("#msg_auction_history").html("Error in detail show")			
		}else{			
			$("#auction_id_hist").val(auctionDataList[0]);
			$("#vehicle_no_hist").val(auctionDataList[9]);
			
			$("#auction_initiated_hist").html(auctionDataList[1]+' <br>'+ auctionDataList[10] +' - '+ auctionDataList[11]);
			$("#vehicle_type_hist").html(auctionDataList[7]+', '+auctionDataList[8]);			
			$("#delivery_date_hist").html(auctionDataList[4]);
			$("#shipping_from_hist").html(auctionDataList[5]+' (To)<br> '+auctionDataList[6]);			
			$("#type_of_goods_hist").html(auctionDataList[12]);
			$("#bit_datetime_hist").html(auctionDataList[17]);
			
			
			var minimumTotal=0
			try{
				minimumTotal=eval(auctionDataList[9])*eval(auctionDataList[18])
			}catch(e){
				minimumTotal=0
				}			
			
			$("#vehicle_rate_hist").val(auctionDataList[18]);		
			$("#total_value_hist").val(minimumTotal);
			
			
			//--------------------------	
			url = "#page_auction_history_details";
			$.mobile.navigate(url);
		}
}


//---------------------- Exit Application
function exit() {	
	navigator.app.exitApp();
}

// ----------------Camera------------

//image Profile
function getPrescriptionImage() {
	navigator.camera.getPicture(onSuccessProfile, onFailProfile, { quality: 10,
		destinationType: Camera.DestinationType.FILE_URI });
}
function onSuccessProfile(imageURI) {
    var image = document.getElementById('myImagePrescription');
    image.src = imageURI;
	imagePath = imageURI;
	$("#prescriptionPhoto").val(imagePath);
}
function onFailProfile(message) {
	imagePath="";
    alert('Failed because: ' + message);
}


//------------------------------------------------------------------------------

//File upload 
function uploadPhoto(imageURI, imageName) {
    var options = new FileUploadOptions();
    options.fileKey="upload";
    options.fileName=imageName;
    options.mimeType="image/jpeg";
	
    var params = {};
    params.value1 = "test";
    params.value2 = "param";
	
    options.params = params;
	
    var ft = new FileTransfer();
     ft.upload(imageURI, encodeURI(localStorage.photo_submit_url+"fileUploaderPrescription/"),winProfile,failProfile,options);
}

function winProfile(r) {
}

function failProfile(error) {
	$("#msg_auction_details").text('Memory Error. Please take new picture and Submit');
}




