using Microsoft.AspNetCore.Mvc;
using MinhaApi.Models;
using MinhaApi.Services;

[ApiController]
[Route("api/[controller]")]
public class DepartamentosController : ControllerBase {
    private readonly IDepartamentosService _service;

    public DepartamentosController(
        IDepartamentosService service)
        => _service = service;

    // GET /api/cliente
    [HttpGet]
    public IActionResult GetAll()
    {
        var departamentos = _service.GetAll();
        return Ok(departamentos);
    }

    // GET /api/departamentos/1
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var departamentos = _service.GetById(id);
        if (departamentos == null)
            return NotFound();
        return Ok(departamentos);
    }
    // POST /api/cliente
    [HttpPost]
    public IActionResult Create(
        [FromBody] Departamentos departamentos)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

    var criado = _service.Create(departamentos);

    return CreatedAtAction(nameof(GetById),new {
     id = criado.Id },criado);
}
    // PUT /api/departamentos/1
    [HttpPut("{id}")]
    public IActionResult Update( int id, [FromBody] Departamentos departamentos)
{
    var atualizado =
        _service.Update(id, departamentos);

    if (atualizado == null)
        return NotFound();

    return Ok(atualizado);
}

    // DELETE /api/departamentos/1
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
{
    var deletado = _service.Delete(id);

    if (!deletado)
        return NotFound();

    return NoContent();
}
}