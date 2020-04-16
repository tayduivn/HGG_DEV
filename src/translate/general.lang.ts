
export class GeneralLanguage {

    public static get Lang_Vn(): any {
        var lang = {};
        // menu
        lang['menu.events'] = 'Sự kiện';
        lang['menu.logoff'] = 'Thoát';
        lang['menu.plan'] = 'Lịch trình';
        lang['menu.planv2'] = 'Lịch trình';
        lang['menu.plansaved'] = 'Lịch trình đã tạo';
        lang['menu.overview'] = 'Tổng quan';
        lang['menu.account'] = 'Tài khoản';

        // login page
        lang['login.form.username'] = 'Tên đăng nhập';
        lang['login.form.password'] = 'Mật khẩu';
        lang['login.form.submitButton'] = 'Đăng nhập';
        lang['login.form.createButton'] = 'Đăng ký';
        lang['login.wrongUserNameOrPassword'] = 'Sai tên đăng nhập hoặc mật khẩu!';
        lang['login.fail.title'] = 'Đăng nhập thất bại';
        
        // map page
        lang['map.title'] = 'Bản đồ';

        // event page
        lang['eventpage.title'] = 'Sự kiện nổi bật';
        lang['eventpage.morePage'] = 'Xem thêm';

        lang['error.valid.required'] = 'Không được để trống';
        lang['error.valid.minLength'] = 'Nhập ít nhất {{0}} kí tự';
        lang['error.valid.maxLength'] = 'Nhập tối đa {{0}} kí tự';
        lang['error.valid.minValue'] = 'Giá trị không ít hơn {{0}}';
        lang['error.valid.maxValue'] = 'Giá trị không vượt quá {{0}}';
        lang['error.valid.dateFormat'] = '';
        lang['form.button.submit'] = 'Lưu';
        lang['form.button.reset'] = 'Nhập lại';
        lang['form.button.close'] = 'Thoát';
        lang['action.success'] = 'Thành công';
        lang['action.error'] = 'Thất bại';
        //trang tổng quan
        lang['overviewpage.title'] = 'Tổng quan';

        //trang quickbooking
        lang['map.cancelButton'] = 'Đóng';
        lang['quickBooking.noResult'] = 'Không tìm thấy khách sạn nào thích hợp. Vui lòng chọn vị trí khác!';
        lang['quickBooking.noResultNext'] = 'Không tìm thấy khách sạn nào thích hợp. Bạn có muốn mở rộng phạm vi tìm kiếm ko?';

        //locales.properties
        lang['network.error'] = 'Lỗi kết nối. Internet không ổn định. Xin vui lòng kiểm tra lại';
        lang['network.title'] = 'Lỗi';
        lang['error.title'] = 'Thất bại!';

        //register
        lang['register.logForm.Address'] = 'Địa chỉ';
        lang['register.logForm.Phone'] = 'Điện thoại';
        lang['register.logForm.ConfirmPassword'] = 'Xác nhận mật khẩu';
        
        return lang;
    }
    public static get Lang_En(): any {
        var lang = {};
        
        // menu
        lang['menu.events'] = 'Events';
        lang['menu.logoff'] = 'Log off';
        lang['menu.plan'] = 'Plan';
        lang['menu.plansaved'] = 'Plan History';
        lang['menu.overview'] = 'Overview';
        lang['menu.account'] = 'Account';

        // login page
        lang['login.form.username'] = 'UserName';
        lang['login.form.password'] = 'Password';
        lang['overviewpage.title'] = 'Overview';

        //register
        lang['register.logForm.Address'] = 'Address';
        lang['register.logForm.Phone'] = 'Phone';
        lang['register.logForm.ConfirmPassword'] = 'Confirm Password';
        return lang;
    }

}
