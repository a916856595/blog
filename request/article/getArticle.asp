<%
dim path
    path = Request.QueryString("path")

set fs = Server.createObject("scripting.FileSystemObject")
    file = Server.mapPath(path)
set txt = fs.openTextFile(file,1,true)
if not txt.atEndOfStream then
   line=txt.readAll
   Response.write line
end if
%>
