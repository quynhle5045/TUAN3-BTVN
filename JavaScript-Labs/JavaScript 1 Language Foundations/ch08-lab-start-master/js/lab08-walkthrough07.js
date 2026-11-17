var	daysOfWeek	=	new	Array("Mon","Tues","Wed",	"Thur",	"Fri");	
daysOfWeek.push("Sat");	
//document.write(daysOfWeek+"<br/>");	
daysOfWeek.unshift("Sun");	
//document.write(daysOfWeek	+	"<br/>");


document.write("<table border=1>");
document.write("<tr>");
for (var i = 0; i < daysOfWeek.length; i++) {
    if (daysOfWeek[i].length < 4)
        day = daysOfWeek[i];
    else
        day = "<em>" + daysOfWeek[i] + "</em>";
    document.write("<th>" + day + "</th>");
}
document.write("</tr>");

// Bổ sung vòng lặp in từ ngày 1 đến 30 (bắt đầu từ Chủ nhật)
for (var d = 1; d <= 30; d++) {
    if (d % 7 == 1) {
        document.write("<tr>");
    }
    document.write("<td>" + d + "</td>");
    if (d % 7 == 0) {
        document.write("</tr>");
    }
}
document.write("</tr>");
document.write("</table>");