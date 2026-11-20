/**
 * 接口统一出口：所有网络请求集中在此，页面只关心业务方法
 */
import request from '../utils/request';

/* ---------------- 登录鉴权 ---------------- */
export const login = (data: { staffNo: string; password: string }) =>
    request.post('/auth/login', data);
export const getUserInfo = () => request.get('/auth/userInfo');
export const updatePassword = (data: { oldPassword: string; newPassword: string }) =>
    request.put('/auth/password', data);

/* ---------------- 班级与学生 ---------------- */
export const getClasses = () => request.get('/classes');
export const getStudents = (params: any) => request.get('/students', { params });
export const getStudentDetail = (stuId: string) => request.get(`/students/${stuId}`);
export const addStudent = (data: any) => request.post('/students', data);
export const updateStudent = (stuId: string, data: any) => request.put(`/students/${stuId}`, data);
export const deleteStudent = (stuId: string) => request.delete(`/students/${stuId}`);
export const addParent = (stuId: string, data: any) => request.post(`/students/${stuId}/parents`, data);
export const deleteParent = (parentId: number) => request.delete(`/parents/${parentId}`);

/* ---------------- 信件 ---------------- */
export const getLetters = (params: any) => request.get('/letters', { params });
export const addLetter = (data: any) => request.post('/letters', data);
export const deleteLetter = (id: number) => request.delete(`/letters/${id}`);

/* ---------------- 问卷 ---------------- */
export const getQnaires = (params?: any) => request.get('/qnaires', { params });
export const getQnaireDetail = (id: number) => request.get(`/qnaires/${id}`);
export const addQnaire = (data: any) => request.post('/qnaires', data);
export const updateQnaire = (id: number, data: any) => request.put(`/qnaires/${id}`, data);
export const saveQuestions = (id: number, questions: any[]) =>
    request.put(`/qnaires/${id}/questions`, { questions });
export const deleteQnaire = (id: number) => request.delete(`/qnaires/${id}`);
export const submitAnswers = (id: number, data: any) => request.post(`/qnaires/${id}/answers`, data);
export const getQnaireStats = (id: number) => request.get(`/qnaires/${id}/stats`);
export const getSubmissions = (id: number, params?: any) =>
    request.get(`/qnaires/${id}/submissions`, { params });
export const getAnswerDetail = (id: number, stuId: string) =>
    request.get(`/qnaires/${id}/answers/${stuId}`);

/* ---------------- 假期申报 ---------------- */
export const getHolidays = (params?: any) => request.get('/holidays', { params });
export const addHoliday = (data: any) => request.post('/holidays', data);
export const updateHolidayStatus = (id: number, status: string) =>
    request.put(`/holidays/${id}/status`, { status });
export const deleteHoliday = (id: number) => request.delete(`/holidays/${id}`);
export const getUnreported = (holidayName: string) =>
    request.get(`/holidays/unreported/${encodeURIComponent(holidayName)}`);

/* ---------------- 成员 ---------------- */
export const getMembers = (params?: any) => request.get('/members', { params });
export const addMember = (data: any) => request.post('/members', data);
export const updateMember = (id: number, data: any) => request.put(`/members/${id}`, data);
export const resetMemberPassword = (id: number, password: string) =>
    request.put(`/members/${id}/password`, { password });
export const deleteMember = (id: number) => request.delete(`/members/${id}`);

/* ---------------- 首页概览 ---------------- */
export const getSummary = () => request.get('/dashboard/summary');
