using Microsoft.AspNetCore.Mvc;
using MinhaApi.Models;
using MinhaApi.Services;
using Microsoft.AspNetCore.Authorization;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class VendaController : ControllerBase
{
    private readonly IVendaService _service;

    public VendaController(IVendaService service)
    {
        _service = service;
    }

    // POST /api/Venda
    [HttpPost]
    public IActionResult Create([FromBody] Venda venda)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var criado = _service.Add(venda);

        return Ok(criado);
    }

    // GET /api/Venda
    [HttpGet]
    public IActionResult GetAll()
    {
        var vendas = _service.GetAll();
        return Ok(vendas);
    }

    // GET /api/Venda/1
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var venda = _service.GetById(id);

        if (venda == null)
            return NotFound();

        return Ok(venda);
    }
}